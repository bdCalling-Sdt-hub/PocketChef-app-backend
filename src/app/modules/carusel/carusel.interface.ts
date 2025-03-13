import { Model } from 'mongoose';

export type ICarusel = {
  category: string
  name: string
  description: string
  bannerImages: string
};

export type CaruselModel = Model<ICarusel>;
