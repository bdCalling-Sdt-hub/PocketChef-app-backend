import { Schema, model } from 'mongoose';
import { IFavorite, FavoriteModel } from './favorite.interface';

const favoriteSchema = new Schema<IFavorite, FavoriteModel>({
  recipeId: {
    type: [Schema.Types.ObjectId],
    ref: 'Recipe',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  folderName: {
    type: String,
    required: false
  }
},
  {
    timestamps: true,
  });

export const Favorite = model<IFavorite, FavoriteModel>('Favorite', favoriteSchema);
