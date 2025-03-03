import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// register user
const createUser = catchAsync(
    async (req: Request, res: Response) => {
        const { ...userData } = req.body;
        const result = await UserService.createUserToDB(userData);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'User created successfully please check your email for verification code.',
            data: result,
        });
    }
);

// register admin
const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createAdminToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin created successfully',
        data: result
    });
});

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user as any);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result
    });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;

        const previousFiles = req.files;

        const updateData: any = {
            name: req.body.name,
            contact: req.body.contact,
            location: req.body.location,
        };

        if (req.files && typeof req.files === 'object' && 'profile' in req.files && Array.isArray(req.files.profile) && req.files.profile.length > 0) {
            updateData.profile = `/profiles/${req.files.profile[0].filename}`;
        }

        const result = await UserService.updateProfileToDB(user, updateData);

        req.files = previousFiles;

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Profile updated successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});





const verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;


    const result = await UserService.verifyOtp(email, otp);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "OTP verified successfully",
        data: result,
    });
});



export const UserController = {
    createUser,
    createAdmin,
    getUserProfile,
    updateProfile,
    verifyOtp
};