import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ITermsAndCondition } from "./termsAndCondition.interface";
import { termsAndConditionModel } from "./termsAndCondition.model";

const createTermsAndCondition = async (payload: ITermsAndCondition): Promise<ITermsAndCondition> => {
    const termsAndCondition = await termsAndConditionModel.create(payload);
    if (!termsAndCondition) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Terms and Condition');
    }

    return termsAndCondition;
};


// update terms and condition

const updateTermsAndCondition = async (id: string, payload: ITermsAndCondition): Promise<ITermsAndCondition | null> => {
    const updatedTermsAndCondition = await termsAndConditionModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedTermsAndCondition) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Condition not found');
    }

    return updatedTermsAndCondition;
};



// delete terms and condition

const deleteTermsAndCondition = async (id: string): Promise<void> => {
    await termsAndConditionModel.findByIdAndDelete(id);
};

// get terms and condition

export const termsAndConditionService = {
    createTermsAndCondition,
    updateTermsAndCondition,
    deleteTermsAndCondition
}