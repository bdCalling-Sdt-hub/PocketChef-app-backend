import { Schema, model } from 'mongoose';
import { ISubcategory } from './subcategory.interface';

const subcategorySchema = new Schema<ISubcategory>({
  // Define schema fields here
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  subCategory: {
    type: String,
    required: true
  }
});

export const Subcategory = model<ISubcategory>('Subcategory', subcategorySchema);
