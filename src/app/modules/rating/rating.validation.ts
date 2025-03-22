import { z } from 'zod';

const createRatingZodSchema = z.object({
    body: z.object({
        star: z.number({
            required_error: 'Star is required',
        }),
        comment: z.string({
            required_error: 'Comment is required',
        }),
        recipeId: z.string({
            required_error: 'Recipe ID is required',
        }),
    }),
});



export const ratingValidations = {
    createRatingZodSchema
};
