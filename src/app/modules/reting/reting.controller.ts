import { Request, Response, NextFunction } from 'express';
import { RetingServices } from './reting.service';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

const createReting = catchAsync(async (req: Request, res: Response) => {
    const result = req.body
    const reting = await RetingServices.createRetingIntoDB(result);
    if (!reting) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Reting')
    }
    sendResponse(res, ({
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reting created successfully',
        data: reting
    }))
})


export const RetingController = {
    createReting
};
