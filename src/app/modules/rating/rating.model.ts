import { Schema, Types, model } from 'mongoose';
import { IRating, ratingModel } from './rating.interface';

const ratingSchema = new Schema<IRating, ratingModel>({
  star: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'recipe',
    required: true,
  }
});

export const rating = model<IRating, ratingModel>('rating', ratingSchema);
