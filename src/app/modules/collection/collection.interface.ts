import { Model, Types } from 'mongoose';

export type ICollection = {
  user: Types.ObjectId;
  name: string
};

export type CollectionModel = Model<ICollection>;
