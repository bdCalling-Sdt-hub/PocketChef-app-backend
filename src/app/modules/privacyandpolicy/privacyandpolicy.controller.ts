import { Request, Response, NextFunction } from 'express';
import { PrivacyandpolicyServices } from './privacyandpolicy.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

const createPrivacyandpolicy = catchAsync(async (req: Request, res: Response) => {
    const { ...privacyandpolicyData } = req.body;
    const result = await PrivacyandpolicyServices.createPrivacyandpolicyIntoDB(privacyandpolicyData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Privacyandpolicy created successfully',
        data: result
    });
});

const getAllPrivacyandpolicy = catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyandpolicyServices.getAllPrivacyandpolicyFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Privacyandpolicy fetched successfully',
        data: result
    });
});

export const PrivacyandpolicyController = {
    createPrivacyandpolicy,
    getAllPrivacyandpolicy
}