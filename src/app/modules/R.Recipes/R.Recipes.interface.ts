import { Types } from "mongoose";

export type IRequestRecipes = {
    userId: Types.ObjectId;
    RequestRecipeBody: string;
    status?: "pending" | "approved";
}