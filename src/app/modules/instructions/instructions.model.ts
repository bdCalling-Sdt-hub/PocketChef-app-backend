import { Schema, model } from 'mongoose';
import { IInstructions } from './instructions.interface';

const instructionsSchema = new Schema<IInstructions>({
  text: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  }
});

export const InstructionsModel = model<IInstructions>('Instructions', instructionsSchema);
