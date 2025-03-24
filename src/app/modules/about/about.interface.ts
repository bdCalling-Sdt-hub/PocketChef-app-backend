import { Model } from 'mongoose';

export type IAbout = {
  document: string;
};

export type AboutModel = Model<IAbout>;
