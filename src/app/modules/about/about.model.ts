import { Schema, model } from 'mongoose';
import { IAbout, AboutModel } from './about.interface';

const aboutSchema = new Schema<IAbout, AboutModel>({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
},
  { timestamps: true }
);

export const About = model<IAbout, AboutModel>('About', aboutSchema);
