import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import ApiError from '../../../errors/ApiErrors';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AdminService.createAdminToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin created Successfully',
        data: result
    });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.params.id;
    const result = await AdminService.deleteAdminFromDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin Deleted Successfully',
        data: result
    });

});

const getAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.getAdminFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin Retrieved Successfully',
        data: result
    });

});

// get all new users base on filter for supper admin

const getNewUserFromDB = catchAsync(async (req: Request, res: Response) => {
    const { filter } = req.query;
    if (!filter || !["weekly", "monthly", "yearly"].includes(filter as string)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid filter");
    }
    const result = await AdminService.getAllNewUser(filter as "weekly" | "monthly" | "yearly");
    if (!result) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get new users");
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'New Users Retrieved Successfully',
        data: result
    })
})

// get active user 
const getUserEngagement = catchAsync(async (req: Request, res: Response) => {
    const { period } = req.query;
    if (!period || !["daily", "weekly", "monthly", "yearly"].includes(period as string)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid period");
    }
    const engagementData = await AdminService.getActiveUsers(period)
    if (!engagementData) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user engagement");
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Engagement Retrieved Successfully',
        data: engagementData
    })
})




export const AdminController = {
    deleteAdmin,
    createAdmin,
    getAdmin,
    getNewUserFromDB,
    getUserEngagement,
};