import { Schema, Types, model } from 'mongoose';
import { IReting, RetingModel } from './reting.interface';

const retingSchema = new Schema<IReting, RetingModel>({
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

export const Reting = model<IReting, RetingModel>('Reting', retingSchema);
