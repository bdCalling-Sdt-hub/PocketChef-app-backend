import { Model } from 'mongoose';

export type IIngredients = {
  ingredientImages: string
  name: string
  subName: string
  description: string
  preparation: string
  amount: number
  unit: string
};

export type IngredientsModel = Model<IIngredients>;
