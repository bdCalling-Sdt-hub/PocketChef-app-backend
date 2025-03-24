import { Schema, model } from 'mongoose';
import { IPrivacyandpolicy, PrivacyandpolicyModel } from './privacyandpolicy.interface';

const privacyandpolicySchema = new Schema<IPrivacyandpolicy, PrivacyandpolicyModel>({

  description: {
    type: String,
    required: true
  }
});
export const Privacyandpolicy = model<IPrivacyandpolicy, PrivacyandpolicyModel>('Privacyandpolicy', privacyandpolicySchema);
