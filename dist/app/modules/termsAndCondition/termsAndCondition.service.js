"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsAndConditionService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const termsAndCondition_model_1 = require("./termsAndCondition.model");
const createTermsAndCondition = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const termsAndCondition = yield termsAndCondition_model_1.termsAndConditionModel.create(payload);
    if (!termsAndCondition) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to created Terms and Condition');
    }
    return termsAndCondition;
});
// update terms and condition
const updateTermsAndCondition = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTermsAndCondition = yield termsAndCondition_model_1.termsAndConditionModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedTermsAndCondition) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Terms and Condition not found');
    }
    return updatedTermsAndCondition;
});
// delete terms and condition
const deleteTermsAndCondition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const termsAndConditionData = yield termsAndCondition_model_1.termsAndConditionModel.findByIdAndDelete(id);
    if (!termsAndConditionData) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Terms and Condition not found');
    }
    // termsAndConditionData is deleted successfully
});
// get terms and condition
exports.termsAndConditionService = {
    createTermsAndCondition,
    updateTermsAndCondition,
    deleteTermsAndCondition
};
