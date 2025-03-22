import { Types } from "mongoose";

export type IReview = {
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    replies?: IReview[];
};

export type IngredientType = {
    ingredientName: Types.ObjectId;
    amount: number;
    unit: string;
};

export type NutritionalValueType = {
    name: string;
    Kcal: string;
};


export type IRecipes = {
    image: string[];
    video: string;
    recipeName: string;
    description: string;
    portionSize: number;
    selectLevel: "Easy" | "Medium" | "Hard";
    category: Types.ObjectId;
    prepTime: number;
    cookTime: number;
    totalTime?: number;
    ingredientName: IngredientType[];
    tags: string[];
    instructions: string[];
    NutritionalValue: NutritionalValueType[];
    subCategory: Types.ObjectId;
};
