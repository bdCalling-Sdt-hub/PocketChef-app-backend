import { Request, Response, NextFunction } from 'express';
import { AboutServices } from './about.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';





const createAbout = catchAsync(async (req: Request, res: Response) => {
    const { ...aboutData } = req.body;
    const result = await AboutServices.createAboutIntoDB(aboutData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'About created successfully',
        data: result
    });
});


const getAllAbout = catchAsync(async (req: Request, res: Response) => {
    const result = await AboutServices.getAllAboutFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'About fetched successfully',
        data: result
    }
    )
});

export const AboutController = {
    createAbout,
    getAllAbout
};
