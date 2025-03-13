import { z } from 'zod';

const createInstructionZodSchema = z.object({
    body: z.object({
        text: z.string().min(1),
        instructions: z.string().min(1),
    }),
});



export const InstructionsValidations = {
    createInstructionZodSchema
};
