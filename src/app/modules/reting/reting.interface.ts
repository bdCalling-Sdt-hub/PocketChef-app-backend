import { Model, Types } from 'mongoose';

export type IReting = {
  star: Number
  comment: string
  userId: Types.ObjectId
  recipeId: Types.ObjectId
};

export type RetingModel = Model<IReting>;
