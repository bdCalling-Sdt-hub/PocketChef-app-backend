import { Schema, model } from 'mongoose';
import { IRecentfavorates, RecentfavoratesModel } from './recentfavorates.interface';

const recentfavoratesSchema = new Schema<IRecentfavorates, RecentfavoratesModel>({
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

export const Recentfavorates = model<IRecentfavorates, RecentfavoratesModel>('Recentfavorates', recentfavoratesSchema);
