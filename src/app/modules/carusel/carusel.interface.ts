import { Model } from 'mongoose';

export type ICarusel = {
  category: string
  name: string
  description: string
  bannerImage: string
};

export type CaruselModel = Model<ICarusel>;
