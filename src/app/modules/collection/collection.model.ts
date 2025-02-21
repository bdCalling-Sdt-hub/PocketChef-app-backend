import { Schema, model } from 'mongoose';
import { ICollection, CollectionModel } from './collection.interface';

const collectionSchema = new Schema<ICollection, CollectionModel>({
  // Define schema fields here
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export const Collection = model<ICollection, CollectionModel>('Collection', collectionSchema);
