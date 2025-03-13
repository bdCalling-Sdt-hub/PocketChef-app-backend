import { z } from 'zod';

const createPrivacyandpolicyZodSchema = z.object({
    body: z.object({
        question: z.string({ required_error: 'Question is required' }),
        answer: z.string({ required_error: 'Answer is required' }),
    })
});
export const PrivacyandpolicyValidations = { createPrivacyandpolicyZodSchema };
