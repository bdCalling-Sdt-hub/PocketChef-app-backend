import { model, Schema } from "mongoose";
import { ITermsAndCondition } from "./termsAndCondition.interface";

const faqSchema = new Schema<ITermsAndCondition>(
    {
        content: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)
export const termsAndConditionModel = model<ITermsAndCondition>("termsAndCondition", faqSchema);