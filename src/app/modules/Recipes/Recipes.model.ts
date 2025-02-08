import { model, Schema } from 'mongoose';
import { IRecipes } from './Recipes.interface';

const recipeSchema = new Schema<IRecipes>(
    {
        recipeName: { type: String, required: true },
        description: { type: String, required: true },
        instructions: { type: [String], required: true }, // HTML formatted instructions can be stored here as strings
        ingredientName: { type: String, required: true },
        ingredientAmount: { type: Number, required: true },
        selectLevel: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },
        mealType: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner"],
            required: true
        },
        portionSize: { type: Number, required: true },
        totalTime: { type: Number, required: true },
        prepTime: { type: Number, required: true },
        cookTime: { type: Number, required: true },
        tags: { type: [String], required: true },
        image: { type: [String], required: true },
        video: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export const Recipe = model<IRecipes>('Recipe', recipeSchema);
