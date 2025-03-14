import { Schema, model } from 'mongoose';
import { IRecommended, RecommendedModel } from './recommended.interface'; 

const recommendedSchema = new Schema<IRecommended, RecommendedModel>({
  // Define schema fields here
});

export const Recommended = model<IRecommended, RecommendedModel>('Recommended', recommendedSchema);
