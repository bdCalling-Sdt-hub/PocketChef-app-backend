import { z } from 'zod';



const createIngredientsZodSchema = z.object({
    body: z.object({
        ingredientImages: z.string(),
        name: z.string(),
        subName: z.string(),
        description: z.string(),
        preparation: z.string(),
    }),
});

const updateIngredientsZodSchema = z.object({
    body: z.object({
        ingredientImages: z.string(),
        name: z.string(),
        subName: z.string(),
        description: z.string(),
        preparation: z.string(),
    }),
});
export const IngredientsValidations = {
    createIngredientsZodSchema,
    updateIngredientsZodSchema
};
