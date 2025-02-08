import { NextFunction, Request, Response, Router } from "express";
import { RecipeController } from "./Recipes.controller";
import { IRecipes } from "./Recipes.interface";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";

const router = Router();

router.post(
    "/create",
    fileUploadHandler(), // Middleware for handling file uploads
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

            // Assign video (if available)
            const video = videoFiles.length > 0 ? videoFiles[0] : undefined;

            // Convert necessary fields from strings (if needed)
            const parsedData: Partial<IRecipes> = {
                ...payload,
                image: images, // Images array
                video, // Single video file path or undefined
            };

            req.body = parsedData;
            next();
        } catch (error) {
            console.error("Error in upload:", error);
            res.status(500).json({ message: "Failed to upload files", error });
        }
    },
    RecipeController.createRecipe
);

export const RecipeRoutes = router;
