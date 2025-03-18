import { Model, Types } from 'mongoose';

export type IRecentfavorates = {
  recipeId: Types.ObjectId;
  userId?: Types.ObjectId;
};

export type RecentfavoratesModel = Model<IRecentfavorates>;
