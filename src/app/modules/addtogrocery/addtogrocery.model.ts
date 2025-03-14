import { Schema, model } from 'mongoose';
import { IAddtogrocery, AddtogroceryModel } from './addtogrocery.interface';

const addtogrocerySchema = new Schema<IAddtogrocery, AddtogroceryModel>({
  // Define schema fields here
  recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},
  {
    timestamps: true,
  }
);

export const Addtogrocery = model<IAddtogrocery, AddtogroceryModel>('Addtogrocery', addtogrocerySchema);
