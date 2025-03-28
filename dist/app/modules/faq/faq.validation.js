"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqValidation = void 0;
const zod_1 = require("zod");
const createFaqZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string({ required_error: 'Question is required' }),
        answer: zod_1.z.string({ required_error: 'Answer is required' }),
    })
});
exports.FaqValidation = {
    createFaqZodSchema
};
