"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeValidation = void 0;
const zod_1 = require("zod");
// ✅ Ingredient Schema
const ingredientSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Ingredient name is required" }).min(1, "Ingredient name cannot be empty"),
    amount: zod_1.z.number({ required_error: "Ingredient amount is required" })
        .positive("Ingredient amount must be a positive number"),
    unit: zod_1.z.string({ required_error: "Ingredient unit is required" }).min(1, "Ingredient unit cannot be empty")
});
// ✅ Create Recipe Schema
const createRecipeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipeName: zod_1.z.string({ required_error: "Recipe name is required" }).min(3, "Recipe name must be at least 3 characters long"),
        description: zod_1.z.string({ required_error: "Description is required" }).min(10, "Description must be at least 10 characters long"),
        instructions: zod_1.z.array(zod_1.z.string({ required_error: "Instruction is required" }).min(5, "Each instruction must be at least 5 characters long")).min(1, { message: "At least one instruction is required" }),
        ingredientName: zod_1.z.array(ingredientSchema).min(1, { message: "At least one ingredient is required" }),
        selectLevel: zod_1.z.enum(["Easy", "Medium", "Hard"], { required_error: "Select level is required" }),
        mealType: zod_1.z.string({ required_error: "Meal type is required" }).min(3, "Meal type must be at least 3 characters long"),
        portionSize: zod_1.z.number({ required_error: "Portion size is required" })
            .int().positive("Portion size must be a positive integer"),
        totalTime: zod_1.z.number().int().positive().optional(),
        prepTime: zod_1.z.number({ required_error: "Prep time is required" })
            .int().positive("Prep time must be a positive integer"),
        cookTime: zod_1.z.number({ required_error: "Cook time is required" })
            .int().positive("Cook time must be a positive integer"),
        tags: zod_1.z.array(zod_1.z.string({ required_error: "Tag is required" }).min(2, "Tag must be at least 2 characters long")).min(1, { message: "At least one tag is required" }),
        keyIngredients: zod_1.z.array(zod_1.z.string({ required_error: "Key ingredient is required" }).min(1, "Key ingredient cannot be empty")).min(1, { message: "At least one key ingredient is required" }),
        dietaryPreferences: zod_1.z.array(zod_1.z.string()).optional(),
        image: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).min(1, { message: "At least one image is required" }),
        video: zod_1.z.string().url("Video must be a valid URL").optional()
    })
});
// ✅ Update Recipe Schema (All Fields Optional)
const updateRecipeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipeName: zod_1.z.string().min(3, "Recipe name must be at least 3 characters long").optional(),
        description: zod_1.z.string().min(10, "Description must be at least 10 characters long").optional(),
        instructions: zod_1.z.array(zod_1.z.string().min(5, "Each instruction must be at least 5 characters long")).min(1, { message: "At least one instruction is required" }).optional(),
        ingredientName: zod_1.z.array(ingredientSchema).optional(),
        selectLevel: zod_1.z.enum(["Easy", "Medium", "Hard"]).optional(),
        mealType: zod_1.z.string().min(3, "Meal type must be at least 3 characters long").optional(),
        portionSize: zod_1.z.number().int().positive("Portion size must be a positive integer").optional(),
        totalTime: zod_1.z.number().int().positive().optional(),
        prepTime: zod_1.z.number().int().positive("Prep time must be a positive integer").optional(),
        cookTime: zod_1.z.number().int().positive("Cook time must be a positive integer").optional(),
        tags: zod_1.z.array(zod_1.z.string().min(2, "Tag must be at least 2 characters long")).optional(),
        keyIngredients: zod_1.z.array(zod_1.z.string().min(1, "Key ingredient cannot be empty")).optional(),
        dietaryPreferences: zod_1.z.array(zod_1.z.string()).optional(),
        image: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).optional(),
        video: zod_1.z.string().url("Video must be a valid URL").optional()
    })
});
exports.RecipeValidation = { createRecipeZodSchema, updateRecipeZodSchema };
