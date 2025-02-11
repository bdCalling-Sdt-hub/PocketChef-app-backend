import { z } from "zod";

const ingredientSchema = z.object({
    name: z.string({ required_error: "Ingredient name is required" }),
    amount: z.number({ required_error: "Ingredient amount is required" }),
    unit: z.string({ required_error: "Ingredient unit is required" })
});

const createRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string({ required_error: "Recipe name is required" }),
        description: z.string({ required_error: "Description is required" }),
        instructions: z.array(
            z.string({ required_error: "Instruction is required" })
        ).min(1, { message: "At least one instruction is required" }),

        ingredientName: z.array(ingredientSchema).min(1, { message: "At least one ingredient is required" }),

        selectLevel: z.enum(["Easy", "Medium", "Hard"], { required_error: "Select level is required" }),

        mealType: z.string({ required_error: "Meal type is required" }),

        portionSize: z.number({ required_error: "Portion size is required" }),

        totalTime: z.number().optional(),
        prepTime: z.number({ required_error: "Prep time is required" }),
        cookTime: z.number({ required_error: "Cook time is required" }),

        tags: z.array(
            z.string({ required_error: "Tag is required" })
        ).min(1, { message: "At least one tag is required" }),

        keyIngredients: z.array(
            z.string({ required_error: "Key ingredient is required" })
        ).min(1, { message: "At least one key ingredient is required" }),

        dietaryPreferences: z.array(z.string()).optional(), // Optional in your model

        image: z.array(z.string()).min(1, { message: "At least one image is required" }),

        video: z.string().optional() // Optional in your model
    })
});

const updateRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string().optional(),
        description: z.string().optional(),
        instructions: z.array(z.string()).min(1, { message: "At least one instruction is required" }).optional(),

        ingredientName: z.array(ingredientSchema).optional(),

        selectLevel: z.enum(["Easy", "Medium", "Hard"]).optional(),

        mealType: z.string().optional(), // Keeping it flexible

        portionSize: z.number().optional(),
        totalTime: z.number().optional(),
        prepTime: z.number().optional(),
        cookTime: z.number().optional(),

        tags: z.array(z.string()).min(1, { message: "At least one tag is required" }).optional(),

        keyIngredients: z.array(z.string()).optional(),
        dietaryPreferences: z.array(z.string()).optional(),

        image: z.array(z.string()).min(1, { message: "At least one image is required" }).optional(),

        video: z.string().optional()
    })
});

export const RecipeValidation = { createRecipeZodSchema, updateRecipeZodSchema };
