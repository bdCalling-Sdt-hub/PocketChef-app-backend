import { Types } from "mongoose";

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

export type IngredientType = {
    ingredientName: Types.ObjectId;
    amount: number;
    unit: string;
};

export type NutritionalValueType = {
    name: string;
    Kcal: string;
};
export type IInstruction = {
    instruction: string;
    image: string[];
};


export type IRecipes = {
    image: string[];
    video: string;
    recipeName: string;
    description: string;
    portionSize: number;
    selectLevel: "Easy" | "Medium" | "Hard";
    category: Types.ObjectId;
    keyIngredients?: string[];
    dietaryPreferences?: string[];
    prepTime: number;
    cookTime: number;
    totalTime?: number;
    instructions: IInstruction[];
    ingredientName: IngredientType[];
    tags: string[];
    NutritionalValue: NutritionalValueType[];
    subCategory: Types.ObjectId;
};
