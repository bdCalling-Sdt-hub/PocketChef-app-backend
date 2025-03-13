import { Schema, model } from 'mongoose';
import { ICarusel, CaruselModel } from './carusel.interface';

const caruselSchema = new Schema<ICarusel, CaruselModel>({
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  bannerImage: { type: String, required: true },

}, {
  timestamps: true,
});

export const Carusel = model<ICarusel, CaruselModel>('Carusel', caruselSchema);
