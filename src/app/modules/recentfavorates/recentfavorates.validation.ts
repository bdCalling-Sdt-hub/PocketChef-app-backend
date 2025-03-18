import { z } from 'zod';



const createRecentfavoratesZodSchema = z.object({
    body: z.object({
        recipeId: z.string(),
        userId: z.string().optional(),
    }),
});




export const RecentfavoratesValidations = {
    createRecentfavoratesZodSchema,
};
