import mongoose, { model, Schema, Types } from "mongoose";
import { IRecipes } from "./Recipes.interface";


// Nutritional Value schema
const NutritionalValueSchema = new Schema({
    name: { type: String, required: true },
    Kcal: { type: String, required: true },
});



// Ingredient schema
const ingredientSchema = new Schema({
    ingredientName: { type: Types.ObjectId, ref: "Ingredients", required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
});

// Instruction schema
// const instructionSchema = new Schema({
//     instruction: { type: String, required: true },
//     instructionImages: { type: String, required: true },
// });

// Recipe Schema
const recipeSchema = new Schema<IRecipes>(
    {
        image: [{ type: String, required: true }],
        video: { type: String, required: false },
        recipeName: { type: String, required: true },
        description: { type: String, required: true },
        portionSize: { type: Number, required: true },
        selectLevel: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        // keyIngredients: [{ type: String, required: false }],
        // dietaryPreferences: [{ type: String, required: false }],
        totalTime: { type: Number, required: false },
        prepTime: { type: Number, required: true },
        cookTime: { type: Number, required: true },
        ingredientName: [ingredientSchema],
        tags: [{ type: String, required: false }],
        instructions: [String],
        NutritionalValue: [NutritionalValueSchema],
        subCategory: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Subcategory",
        },
    },
    {
        timestamps: true,
    }
);

export const Recipe = model<IRecipes>("Recipe", recipeSchema);

// Recently Viewed Schema
const RecentlyViewedSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const RecentlyViewed = mongoose.model("RecentlyViewed", RecentlyViewedSchema);
