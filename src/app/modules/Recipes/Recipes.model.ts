import { model, Schema } from 'mongoose';
import { IRecipes } from './Recipes.interface';

// Define the ingredient schema properly
const ingredientSchema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
});

// like schema
const favoriteSchema = new Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});


// comment schema
const reviewSchema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [{ type: Schema.Types.Mixed }]
});

// Define the main recipe schema
const recipeSchema = new Schema<IRecipes>(
    {
        image: [{ type: String, required: true }],
        video: { type: String, required: false },
        recipeName: { type: String, required: true },
        description: { type: String, required: true },
        portionSize: { type: Number, required: true },
        selectLevel: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
        mealType: { type: String, required: true },
        keyIngredients: [{ type: String, required: true }],
        dietaryPreferences: [{ type: String, required: false }],
        totalTime: { type: Number, required: false },
        prepTime: { type: Number, required: true },
        cookTime: { type: Number, required: true },
        instructions: [{ type: String, required: true }],
        ingredientName: [ingredientSchema],
        tags: [{ type: String, required: false }],
        favorite: [favoriteSchema],
        review: [reviewSchema]
    },
    {
        timestamps: true
    }
);

export const Recipe = model<IRecipes>('recipe', recipeSchema);
