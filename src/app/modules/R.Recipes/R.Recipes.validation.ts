import { z } from "zod";

const createRequestRecipeZodSchema = z.object({
    body: z.object({
        userId: z.string({
            required_error: 'UserId is required',
            invalid_type_error: 'UserId must be a string'
        }),
        RequestRecipeBody: z.string({
            required_error: 'RequestRecipeBody are required',
            invalid_type_error: 'RequestRecipeBody must be a string'
        }),
        status: z.enum(["pending", "approved"]).optional()
    })
});

const updateRequestRecipeZodSchema = z.object({
    body: z.object({
        userId: z.string().optional(),
        RequestRecipeBody: z.string().optional(),
        status: z.enum(["pending", "approved"]).optional()
    })
})

export const RequestRecipeValidation = {
    createRequestRecipeZodSchema,
    updateRequestRecipeZodSchema
};