import { Model, Types } from 'mongoose';

export type IAddtogrocery = {
  recipe: Types.ObjectId,
  user: Types.ObjectId
};

export type AddtogroceryModel = Model<IAddtogrocery>;
