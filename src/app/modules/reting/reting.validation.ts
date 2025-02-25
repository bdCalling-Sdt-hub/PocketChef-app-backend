import { z } from 'zod';

const createRetingZodSchema = z.object({
    body: z.object({
        star: z.number({
            required_error: 'Star is required',
        }),
        comment: z.string({
            required_error: 'Comment is required',
        }),
        userId: z.string({
            required_error: 'User ID is required',
        }),
        recipeId: z.string({
            required_error: 'Recipe ID is required',
        }),
    }),
});



export const RetingValidations = {
    createRetingZodSchema
};
