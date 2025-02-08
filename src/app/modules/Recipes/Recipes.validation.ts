import { z } from "zod";

const createRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string({ required_error: "Recipe name is required" }),
        description: z.string({ required_error: "Description is required" }),
        instructions: z.array(z.string({ required_error: "Instruction is required" })).min(1, { message: "At least one instruction is required" }),
        ingredientName: z.string({ required_error: "Ingredient name is required" }),
        ingredientAmount: z.number({ required_error: "Ingredient amount is required" }),
        selectLevel: z.enum(["Easy", "Medium", "Hard"], { required_error: "Select level is required" }),
        mealType: z.enum(["Breakfast", "Lunch", "Dinner"], { required_error: "Meal type is required" }),
        portionSize: z.number({ required_error: "Portion size is required" }),
        totalTime: z.number({ required_error: "Total time is required" }),
        prepTime: z.number({ required_error: "Prep time is required" }),
        cookTime: z.number({ required_error: "Cook time is required" }),
        tags: z.array(z.string({ required_error: "Tag is required" })).min(1, { message: "At least one tag is required" }),
        image: z.array(z.string()).min(1, { message: "At least one image is required" }),
        video: z.string({ required_error: "Video is required" }),
    })
});




const updateRecipeZodSchema = z.object({
    body: z.object({
        recipeName: z.string().optional(),
        description: z.string().optional(),
        instructions: z.array(z.string()).min(1, { message: "At least one instruction is required" }).optional(),
        ingredientName: z.string().optional(),
        ingredientAmount: z.number().optional(),
        selectLevel: z.enum(["Easy", "Medium", "Hard"]).optional(),
        mealType: z.enum(["Breakfast", "Lunch", "Dinner"]).optional(),
        portionSize: z.number().optional(),
        totalTime: z.number().optional(),
        prepTime: z.number().optional(),
        cookTime: z.number().optional(),
        tags: z.array(z.string()).min(1, { message: "At least one tag is required" }).optional(),
        image: z.array(z.string()).min(1, { message: "At least one image is required" }).optional(),
        video: z.string().optional(),
    })
});

export const RecipeValidation = { createRecipeZodSchema, updateRecipeZodSchema };
