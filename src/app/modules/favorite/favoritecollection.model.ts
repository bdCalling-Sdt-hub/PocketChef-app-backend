import { Schema, model } from 'mongoose';
import { IFavoriteCollection, FavoriteCollectionModel } from './favoritecollection.interface';

const favoriteCollectionSchema = new Schema<IFavoriteCollection, FavoriteCollectionModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  collection: {
    type: Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  }
}, {
  timestamps: true,

});

export const FavoriteCollection = model<IFavoriteCollection, FavoriteCollectionModel>('Favoritecollection', favoriteCollectionSchema);
