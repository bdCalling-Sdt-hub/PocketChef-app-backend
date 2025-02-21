import { Request, Response, NextFunction } from 'express';
import { CollectionServices } from './collection.service';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

const createController = catchAsync(async (req: Request, res: Response) => {
    const { collection } = req.body;
    const result = await CollectionServices.createCollectionIntoDB(collection);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Collection');
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Collection created successfully',
        data: result
    })
})


export const CollectionController = {
    createController
};
