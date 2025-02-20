import { Types } from "mongoose";

export type IRequestRecipes = {
    userId: Types.ObjectId;
    ingredients: string;
}