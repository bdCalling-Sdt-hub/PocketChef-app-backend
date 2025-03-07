import { Model, Types } from 'mongoose';

export type ISubcategory = {
  category: Types.ObjectId,
  subCategory: string
};

