export type IIngredient = {
    name: string;
    amount: number;
    unit: string;
};
export type ILike = {
    userId: string; // User who liked
    timestamp: Date; // When the like was made
};
export type IComment = {
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    replies?: IComment[];
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
    prepTime: number;
    cookTime: number;
    totalTime?: number;
    instructions: string[];
    ingredientName: IIngredient[];
    tags: string[];
    like?: ILike[]
    comment?: IComment[]
}