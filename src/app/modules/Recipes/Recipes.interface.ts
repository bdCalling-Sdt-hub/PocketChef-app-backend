export type IRecipes = {
    recipeName: string;
    description: string;
    instructions: string[];
    ingredientName: string;
    ingredientAmount: number;
    selectLevel: "Easy" | "Medium" | "Hard";
    mealType: "Breakfast" | "Lunch" | "Dinner";
    portionSize: number; //number of persons
    totalTime: number;
    prepTime: number;
    cookTime: number;
    tags: string[];
    imageAndVideo: string[];
}