import { z } from 'zod';

const createPrivacyandpolicyZodSchema = z.object({
    body: z.object({
        description: z.string({ required_error: 'Description is required' }),
    })
});
export const PrivacyandpolicyValidations = { createPrivacyandpolicyZodSchema };
