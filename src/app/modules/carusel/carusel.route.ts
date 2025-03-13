import express, { NextFunction, Request, Response } from 'express';
import { CaruselController } from './carusel.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CaruselValidations } from './carusel.validation';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getSingleFilePath } from '../../../shared/getFilePath';

const router = express.Router();
router.post("/",

    fileUploadHandler() as any,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files) {
                throw new Error('No files uploaded');
            }
            const payload = req.body;
            const bannerImage = getSingleFilePath(req.files, 'bannerImage' as any);
            req.body = {
                bannerImage,
                ...payload
            };
            next();
        } catch (error) {
            res.status(400).json({ error: error });
        }
    },


    validateRequest(CaruselValidations.createCaruselZodSchema), CaruselController.createCarusel);
router.get('/', CaruselController.getAllCarusel);





export const CaruselRoutes = router;
