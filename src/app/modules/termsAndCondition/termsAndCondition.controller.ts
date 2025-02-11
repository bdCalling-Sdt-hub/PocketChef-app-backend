import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { termsAndConditionService } from "./termsAndCondition.service";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

const createTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await termsAndConditionService.createTermsAndCondition(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Terms and Condition');
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Terms and Condition created successfully',
        data: result
    })
})



// update terms and condition

const updateTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await termsAndConditionService.updateTermsAndCondition(id, payload);
    if (result === undefined) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Condition not found');
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Terms and Condition updated successfully',
        data: result
    })
})

// delete terms and condition

const deleteTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await termsAndConditionService.deleteTermsAndCondition(id);
    if (result === undefined) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Condition not found');
    }
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and Condition deleted successfully',
        data: result,
    })
})


// export function to get all terms and conditions
export const termsAndConditionController = {
    createTermsAndCondition,
    updateTermsAndCondition,
    deleteTermsAndCondition
}