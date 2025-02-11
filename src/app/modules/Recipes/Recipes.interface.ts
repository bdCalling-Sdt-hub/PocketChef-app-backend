export type IIngredient = {
    name: string;
    amount: number;
    unit: string;
};





export type IRecipes = {
    image: string[]
    video: string;
    recipeName: string;
    description: string;
    portionSize: number;
    selectLevel: "Easy" | "Medium" | "Hard";
    mealType: string;
    keyIngredients: string[];
    dietaryPreferences: string[];
    totalTime?: number;
    prepTime: number;
    cookTime: number;
    instructions: string[];
    ingredientName: IIngredient[];
    tags: string[];
}