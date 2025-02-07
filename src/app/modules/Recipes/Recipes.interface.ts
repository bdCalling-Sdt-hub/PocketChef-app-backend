export type IRecipes = {
    recipeName: string;
    description: string;
    instructions: [string]
    ingredientName: [string];
    ingredientPrice: number;
    // level: enum
    // course: enum
    // Ingredient: enum
    // selectByDiet: enum
    // cookingMethod: enum;
    totalTime: string;
    prepTime: string;
    cookTime: string;
    tags: [string];
    imageAndVideo: [string];
}


// name: String,
// description: String,
// portionSize: Number,
// level: String,
// course: String,
// keyIngredient: String,
// dietType: String,
// cookingMethod: String,
// totalTime: String,
// prepTime: String,
// cookTime: String,
// instructions: [String],
// ingredients: [{ name: String, amount: Number, unit: String }],
// tags: [String],
// images: [String],
// createdAt: { type: Date, default: Date.now }