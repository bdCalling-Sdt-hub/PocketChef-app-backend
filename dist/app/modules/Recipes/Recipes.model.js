"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const mongoose_1 = require("mongoose");
// Define the ingredient schema properly
const ingredientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
});
// like schema
const favoriteSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
// comment schema
const reviewSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [{ type: mongoose_1.Schema.Types.Mixed }]
});
// Define the main recipe schema
const recipeSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true
});
exports.Recipe = (0, mongoose_1.model)('recipe', recipeSchema);
