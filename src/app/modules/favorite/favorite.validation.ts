import { z } from 'zod';


const createFavoritesValidation = z.object({
    body: z.object({
        user: z.string({
            required_error: 'User is required'
        }),
        recipe: z.string({
            required_error: 'Recipe is required'
        }),
        collection: z.string().optional()
    })
})


export const FavoritesValidation = {
    createFavoritesValidation
};