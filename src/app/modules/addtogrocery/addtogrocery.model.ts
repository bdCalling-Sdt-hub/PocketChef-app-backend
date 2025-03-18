import { Schema, model } from 'mongoose';
import { IAddtogrocery, AddtogroceryModel } from './addtogrocery.interface';

const addtogrocerySchema = new Schema<IAddtogrocery, AddtogroceryModel>({
  recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
},
  {
    timestamps: true,
  }
);

export const Addtogrocery = model<IAddtogrocery, AddtogroceryModel>('Addtogrocery', addtogrocerySchema);
