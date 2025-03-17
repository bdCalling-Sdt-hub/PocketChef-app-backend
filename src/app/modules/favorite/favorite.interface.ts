import { Model, Types } from 'mongoose';

export type IFavorite = {
  recipeId: Types.ObjectId;
  userId?: Types.ObjectId;
  folderName?: string;
};

export type FavoriteModel = Model<IFavorite>;
