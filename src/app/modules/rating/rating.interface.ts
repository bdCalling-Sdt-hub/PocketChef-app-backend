import { Model, Types } from 'mongoose';

export type IRating = {
  star: Number
  comment: string
  userId?: Types.ObjectId
  recipeId: Types.ObjectId
};

export type ratingModel = Model<IRating>;
