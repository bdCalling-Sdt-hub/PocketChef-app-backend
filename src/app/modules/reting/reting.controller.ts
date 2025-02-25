import { Request, Response, NextFunction } from 'express';
import { RetingServices } from './reting.service';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

const createReting = catchAsync(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    const { star, comment } = req.body;
    const retingData = { userId: req.user?.id, star, comment };

    const reting = await RetingServices.createRetingIntoDB(retingData);
    if (!reting) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Rating");
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Rating created successfully",
        data: reting,
    });
})


export const RetingController = {
    createReting
};
