import { Model, Types } from 'mongoose';

export type IFavoriteCollection = {
  user: Types.ObjectId;
  post: Types.ObjectId;
  collection: Types.ObjectId
};

export type FavoriteCollectionModel = Model<IFavoriteCollection>;
