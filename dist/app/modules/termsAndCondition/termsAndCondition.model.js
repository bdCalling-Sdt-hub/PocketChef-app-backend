"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsAndConditionModel = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.termsAndConditionModel = (0, mongoose_1.model)("termsAndCondition", faqSchema);
