import { Schema, model } from 'mongoose';
import { IIngredients, IngredientsModel } from './ingredients.interface';

const ingredientsSchema = new Schema<IIngredients, IngredientsModel>({
  ingredientImages: { type: String, required: true },
  name: { type: String, required: true },
  subName: { type: String, required: true },
  description: { type: String, required: true },
  preparation: { type: String, required: true }
},
  {
    timestamps: true
  });

export const Ingredients = model<IIngredients, IngredientsModel>('Ingredients', ingredientsSchema);
