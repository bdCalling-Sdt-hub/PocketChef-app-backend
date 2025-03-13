import { z } from 'zod';


const createCaruselZodSchema = z.object({
    body: z.object({
        category: z.string({
            required_error: 'Category is required',
        }),
    }),
});


export const CaruselValidations = {
    createCaruselZodSchema
};
