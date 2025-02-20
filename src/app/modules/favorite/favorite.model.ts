import { Schema, model } from 'mongoose';
import { IFavorite, FavoriteModel } from './favorite.interface';

const favoriteSchema = new Schema<IFavorite, FavoriteModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'recipe',
    required: true
  },
  collection: {
    type: Schema.Types.ObjectId,
    ref: 'Collection',
    required: false,
    default: null,
  }
},
  {
    timestamps: true,
  });

export const Favorite = model<IFavorite, FavoriteModel>('Favorite', favoriteSchema);
