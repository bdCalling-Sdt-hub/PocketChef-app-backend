import { z } from 'zod';

const createFavoriteZodSchema = z.object({
    body: z.object({
        recipeId: z.string(),
        folderName: z.string().optional()
    }),
});

const updateFavoriteZodSchema = z.object({
    body: z.object({
        recipeId: z.string(),
        folderName: z.string().optional()
    }),
});

export const FavoriteValidations = {
    createFavoriteZodSchema,
    updateFavoriteZodSchema
};
