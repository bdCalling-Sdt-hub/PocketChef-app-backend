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
    const result = await UserService.getUserProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result
    });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let profile;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }

    const data = {
        profile,
        ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result
    });
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