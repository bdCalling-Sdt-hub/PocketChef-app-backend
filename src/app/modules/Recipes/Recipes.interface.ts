import { Types } from "mongoose";

export type IIngredient = {
    name: string;
    amount: number;
    unit: string;
};
export type IFavorite = {
    userId: string;
    timestamp: Date;
};
export type IReview = {
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    replies?: IReview[];
};

export type IRecipes = {
    image: string[]
    video: string;
    recipeName: string;
    description: string;
    portionSize: number;
    selectLevel: "Easy" | "Medium" | "Hard";
    category: Types.ObjectId;
    keyIngredients: string[];
    dietaryPreferences: string[];
    prepTime: number;
    cookTime: number;
    totalTime?: number;
    instructions: string[];
    ingredientName: IIngredient[];
    tags: string[];
    NutritionalValue: string[]
    subCategory: Types.ObjectId
    // favorite?: IFavorite[]
    // review?: IReview[]
}