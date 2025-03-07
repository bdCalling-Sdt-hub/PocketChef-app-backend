import { z } from 'zod';


const createSubCategory = z.object({
    body: z.object({
        category: z.string({
            required_error: "Category id is required"
        }),
        subCategory: z.string({
            required_error: "Subcategory Must be string"
        })
    })
})


export const SubcategoryValidations = {
    createSubCategory
};
