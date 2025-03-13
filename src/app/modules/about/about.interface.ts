import { Model } from 'mongoose';

export type IAbout = {
  question: string;
  answer: string;
};

export type AboutModel = Model<IAbout>;
