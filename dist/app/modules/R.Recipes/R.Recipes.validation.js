"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRecipeValidation = void 0;
const zod_1 = require("zod");
const createRequestRecipeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: 'UserId is required',
            invalid_type_error: 'UserId must be a string'
        }),
        RequestRecipeBody: zod_1.z.string({
            required_error: 'RequestRecipeBody are required',
            invalid_type_error: 'RequestRecipeBody must be a string'
        })
    })
});
const updateRequestRecipeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        RequestRecipeBody: zod_1.z.string().optional()
    })
});
exports.RequestRecipeValidation = {
    createRequestRecipeZodSchema,
    updateRequestRecipeZodSchema
};
