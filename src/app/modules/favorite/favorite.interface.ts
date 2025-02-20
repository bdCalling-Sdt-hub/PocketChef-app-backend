import { Model, Types } from 'mongoose';

export type IFavorite = {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  collection?: Types.ObjectId
};

export type FavoriteModel = Model<IFavorite>;
