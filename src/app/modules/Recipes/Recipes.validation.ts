import { z } from "zod";

// ✅ Ingredient Schema
const ingredientSchema = z.object({
    name: z.string({ required_error: "Ingredient name is required" }).min(1, "Ingredient name cannot be empty"),
    amount: z.number({ required_error: "Ingredient amount is required" })
        .positive("Ingredient amount must be a positive number"),
    unit: z.string({ required_error: "Ingredient unit is required" }).min(1, "Ingredient unit cannot be empty")
});

// ✅ Create Recipe Schema
const createRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string({ required_error: "Recipe name is required" }).min(3, "Recipe name must be at least 3 characters long"),
        description: z.string({ required_error: "Description is required" }).min(10, "Description must be at least 10 characters long"),

        instructions: z.array(
            z.string({ required_error: "Instruction is required" }).min(5, "Each instruction must be at least 5 characters long")
        ).min(1, { message: "At least one instruction is required" }),

        ingredientName: z.array(ingredientSchema).min(1, { message: "At least one ingredient is required" }),

        selectLevel: z.enum(["Easy", "Medium", "Hard"], { required_error: "Select level is required" }),

        mealType: z.string({ required_error: "Meal type is required" }).min(3, "Meal type must be at least 3 characters long"),

        portionSize: z.number({ required_error: "Portion size is required" })
            .int().positive("Portion size must be a positive integer"),

        totalTime: z.number().int().positive().optional(),
        prepTime: z.number({ required_error: "Prep time is required" })
            .int().positive("Prep time must be a positive integer"),
        cookTime: z.number({ required_error: "Cook time is required" })
            .int().positive("Cook time must be a positive integer"),

        tags: z.array(
            z.string({ required_error: "Tag is required" }).min(2, "Tag must be at least 2 characters long")
        ).min(1, { message: "At least one tag is required" }),

        keyIngredients: z.array(
            z.string({ required_error: "Key ingredient is required" }).min(1, "Key ingredient cannot be empty")
        ).min(1, { message: "At least one key ingredient is required" }),

        dietaryPreferences: z.array(z.string()).optional(),

        image: z.array(
            z.string().url("Each image must be a valid URL")
        ).min(1, { message: "At least one image is required" }),

        video: z.string().url("Video must be a valid URL").optional()
    })
});

// ✅ Update Recipe Schema (All Fields Optional)
const updateRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string().min(3, "Recipe name must be at least 3 characters long").optional(),
        description: z.string().min(10, "Description must be at least 10 characters long").optional(),

        instructions: z.array(
            z.string().min(5, "Each instruction must be at least 5 characters long")
        ).min(1, { message: "At least one instruction is required" }).optional(),

        ingredientName: z.array(ingredientSchema).optional(),

        selectLevel: z.enum(["Easy", "Medium", "Hard"]).optional(),

        mealType: z.string().min(3, "Meal type must be at least 3 characters long").optional(),

        portionSize: z.number().int().positive("Portion size must be a positive integer").optional(),
        totalTime: z.number().int().positive().optional(),
        prepTime: z.number().int().positive("Prep time must be a positive integer").optional(),
        cookTime: z.number().int().positive("Cook time must be a positive integer").optional(),

        tags: z.array(z.string().min(2, "Tag must be at least 2 characters long")).optional(),

        keyIngredients: z.array(z.string().min(1, "Key ingredient cannot be empty")).optional(),
        dietaryPreferences: z.array(z.string()).optional(),

        image: z.array(z.string().url("Each image must be a valid URL")).optional(),

        video: z.string().url("Video must be a valid URL").optional()
    })
});

export const RecipeValidation = { createRecipeZodSchema, updateRecipeZodSchema };
