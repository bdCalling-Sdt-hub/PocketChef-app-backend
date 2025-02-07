import { NextFunction, Request, Response, Router } from "express";
import { RecipeController } from "./Recipes.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getMultipleFilesPath } from "../../../shared/getFilePath";
import { IRecipes } from "./Recipes.interface";

const router = Router()

router.post(
    '/create',
    fileUploadHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
        console.log("Uploaded files:", req.files); // Log the files to see if they are being received

        // Continue with processing
        try {
            const payload = req.body;
            const imagesAndVideos: string[] = [
                ...getMultipleFilesPath(req.files?.['image'], 'image'),
                ...getMultipleFilesPath(req.files?.['media'], 'media')
            ];

            const recipeData: IRecipes = {
                recipeName: payload.recipeName,
                description: payload.description,
                instructions: payload.instructions || [],
                ingredientName: payload.ingredientName,
                ingredientAmount: payload.ingredientAmount,
                selectLevel: payload.selectLevel,
                mealType: payload.mealType,
                portionSize: payload.portionSize,
                totalTime: payload.totalTime,
                prepTime: payload.prepTime,
                cookTime: payload.cookTime,
                tags: payload.tags || [],
                imageAndVideo: imagesAndVideos,
            };

            req.body = recipeData;
            next();
        } catch (error) {
            console.error("Error in upload:", error);
            res.status(500).json({ message: 'Failed to upload files', error });
        }
    },
    RecipeController.createRecipe
);

export const RecipeRoutes = router;