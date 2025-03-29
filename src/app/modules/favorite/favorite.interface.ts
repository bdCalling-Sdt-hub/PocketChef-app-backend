import { Model, Types } from 'mongoose';

export type IFavorite = {
  _id?: Types.ObjectId;
  recipeId: Types.ObjectId[];
  userId?: Types.ObjectId;
  folderName?: string;
};

export type FavoriteModel = Model<IFavorite>;