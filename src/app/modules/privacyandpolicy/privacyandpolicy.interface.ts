import { Model } from 'mongoose';

export type IPrivacyandpolicy = {
  // Define the interface for Privacyandpolicy here
  question: string;
  answer: string;
};

export type PrivacyandpolicyModel = Model<IPrivacyandpolicy>;
