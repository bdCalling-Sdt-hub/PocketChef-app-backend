import { Schema, model } from 'mongoose';
import { IInstructions } from './instructions.interface';

const instructionsSchema = new Schema<IInstructions>({
  text: {
    type: String,
    required: true
  },
  instructionsImage: {
    type: String,
    required: false
  }
});

export const InstructionsModel = model<IInstructions>('Instructions', instructionsSchema);
