import { z } from "zod";

const createRequestRecipeZodSchema = z.object({
    body: z.object({
        userId: z.string({
            required_error: 'UserId is required',
            invalid_type_error: 'UserId must be a string'
        }),
        ingredients: z.string({
            required_error: 'Ingredients are required',
            invalid_type_error: 'Ingredients must be a string'
        })
    })
});

const updateRequestRecipeZodSchema = z.object({
    body: z.object({
        userId: z.string().optional(),
        ingredients: z.string().optional()
    })
})

export const RequestRecipeValidation = {
    createRequestRecipeZodSchema,
    updateRequestRecipeZodSchema
};