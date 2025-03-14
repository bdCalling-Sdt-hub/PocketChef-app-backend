import { NextFunction, Request, Response, Router } from "express";
import { RecipeController } from "./Recipes.controller";
import { IRecipes } from "./Recipes.interface";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { RecipeValidation } from "./Recipes.validation";
import validateRequest from "../../middlewares/validateRequest";
import { getMultipleFilesPath, getSingleFilePath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

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

// all recipes route
router.get("/", RecipeController.getAllRecipe);

router.get('/recently-viewed', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), RecipeController.getRecentlyViewed);


// update recipe route
router.patch(
    "/update/:id",
    fileUploadHandler() as any,
    // validateRequest(RecipeValidation.updateRecipeZodSchema),
    RecipeController.updateRecipe
);



// single recipe route

router.get("/:id", auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RecipeController.getSingleRecipe);

// delete recipe route

router.delete("/:id", RecipeController.deleteRecipe);





export const RecipeRoutes = router;
