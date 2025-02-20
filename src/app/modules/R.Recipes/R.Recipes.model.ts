import { model, Schema } from "mongoose";
import { IRequestRecipes } from "./R.Recipes.interface";

const requestRecipes = new Schema<IRequestRecipes>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        ingredients: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const RequestRecipe = model<IRequestRecipes>("requestReciPes", requestRecipes)