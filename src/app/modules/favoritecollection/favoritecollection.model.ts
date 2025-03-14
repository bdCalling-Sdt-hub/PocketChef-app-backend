import { Schema, model } from 'mongoose';
import { IFavoritecollection, FavoritecollectionModel } from './favoritecollection.interface'; 

const favoritecollectionSchema = new Schema<IFavoritecollection, FavoritecollectionModel>({
  // Define schema fields here
});

export const Favoritecollection = model<IFavoritecollection, FavoritecollectionModel>('Favoritecollection', favoritecollectionSchema);
