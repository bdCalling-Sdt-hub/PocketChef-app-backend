import express from 'express';
import { IngredientsController } from './ingredients.controller';
import validateRequest from '../../middlewares/validateRequest';
import { IngredientsValidations } from './ingredients.validation';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();


router.post('/',
    fileUploadHandler() as any, // File upload middleware
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files) {
                throw new Error('No files uploaded');
            }

            // Extract payload from FormData
            const payload = req.body;

            // Get the image path
            // @ts-ignore
            const ingredientImages = getSingleFilePath(req.files, 'ingredientImages' as any);

            // Convert FormData to JSON manually
            req.body = {
                ingredientImages,
                name: payload.name,
                subName: payload.subName,
                description: payload.description,
                preparation: payload.preparation,
            };

            next(); // Pass to Zod validation
        } catch (error) {
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Failed to create ingredients",
                data: null
            });
        }
    },
    validateRequest(IngredientsValidations.createIngredientsZodSchema),
    IngredientsController.createIngredients
);



router.get('/', IngredientsController.getAllIngredients);

export const IngredientsRoutes = router;
