import { NextFunction, Request, Response, Router } from "express";
import { RecipeController } from "./Recipes.controller";
import { IRecipes } from "./Recipes.interface";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { RecipeValidation } from "./Recipes.validation";
import validateRequest from "../../middlewares/validateRequest";
import { getMultipleFilesPath, getSingleFilePath } from "../../../shared/getFilePath";

const router = Router();

// create recipe route

router.post(
    "/create",
    fileUploadHandler() as any,
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.files) {
                throw new Error('No files uploaded');
            }

            const payload = req.body;
            const image = getMultipleFilesPath(req.files, 'image');
            const video = getSingleFilePath(req.files, 'video' as any);

            req.body = {
                image,
                video,
                ...payload
            };

            next();
        } catch (error) {
            res.status(400).json({ error: error });
        }
    },
    RecipeController.createRecipe
);


// update recipe route
router.patch(
    "/update/:id",
    // validateRequest(RecipeValidation.updateRecipeZodSchema),
    RecipeController.updateRecipe
);

// all recipes route
router.get("/", RecipeController.getAllRecipe);

// single recipe route

router.get("/:id", RecipeController.getSingleRecipe);

// delete recipe route

router.delete("/:id", RecipeController.deleteRecipe);


export const RecipeRoutes = router;
