import { Model, Types } from 'mongoose';

export type IAddtogrocery = {
  recipe: Types.ObjectId,
  userId?: Types.ObjectId
};

export type AddtogroceryModel = Model<IAddtogrocery>;
