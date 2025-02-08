import { NextFunction, Request, Response, Router } from "express";
import { RecipeController } from "./Recipes.controller";
import { IRecipes } from "./Recipes.interface";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { RecipeValidation } from "./Recipes.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
    "/create",
    fileUploadHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = req.body;

            // Function to extract file paths
            const getFilePaths = (files: Express.Multer.File[] | undefined): string[] => {
                return files ? files.map((file) => file.path) : [];
            };

            // Extract images and videos separately
            const images = getFilePaths(req.files?.["image"] as Express.Multer.File[]);
            const videoFiles = getFilePaths(req.files?.["video"] as Express.Multer.File[]);
            const video = videoFiles.length > 0 ? videoFiles[0] : undefined;
            const prepTime = Number(payload.prepTime);
            const cookTime = Number(payload.cookTime);
            const totalTime = prepTime + cookTime;
            // Convert necessary fields from strings (if needed)
            const parsedData: Partial<IRecipes> = {
                ...payload,
                image: images,
                video,
                instructions: typeof payload.instructions === "string" ? JSON.parse(payload.instructions) : payload.instructions,
                tags: typeof payload.tags === "string" ? JSON.parse(payload.tags) : payload.tags,
                ingredientAmount: Number(payload.ingredientAmount),
                portionSize: Number(payload.portionSize),
                totalTime,
                prepTime,
                cookTime,
            };

            req.body = parsedData;
            next();
        } catch (error) {
            console.error("Error in upload:", error);
            res.status(500).json({ message: "Failed to upload files", error });
        }
    },
    validateRequest(RecipeValidation.createRecipeZodSchema),
    RecipeController.createRecipe
);



// update recipe route
router.patch(
    "/update/:id",
    validateRequest(RecipeValidation.updateRecipeZodSchema),
    RecipeController.updateRecipe
);

// all recipes route
router.get("/", RecipeController.getAllRecipe);

// single recipe route

router.get("/:id", RecipeController.getSingleRecipe);

// delete recipe route

router.delete("/:id", RecipeController.deleteRecipe);


export const RecipeRoutes = router;
