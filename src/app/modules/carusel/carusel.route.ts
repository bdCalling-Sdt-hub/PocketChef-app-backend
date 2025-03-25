import express, { NextFunction, Request, Response } from 'express';
import { CaruselController } from './carusel.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CaruselValidations } from './carusel.validation';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post("/",

    fileUploadHandler() as any,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files) {
                throw new Error('No files uploaded');
            }
            const payload = req.body;
            const bannerImages = getSingleFilePath(req.files, 'bannerImages' as any);

            req.body = {
                bannerImages,
                ...payload
            };
            next();
        } catch (error) {
            res.status(400).json({ error: error });
        }
    },


    validateRequest(CaruselValidations.createCaruselZodSchema), CaruselController.createCarusel);
router.get('/', CaruselController.getAllCarusel);

// delete carusel
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), CaruselController.deleteCarusel);


export const CaruselRoutes = router;
