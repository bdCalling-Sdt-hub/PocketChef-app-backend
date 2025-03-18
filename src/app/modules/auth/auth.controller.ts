import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import ApiError from '../../../errors/ApiErrors';

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, oneTimeCode } = req.body;

    const result = await AuthService.verifyEmailToDB({ email, oneTimeCode });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
        data: result,
    });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AuthService.loginUserFromDB(loginData);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User logged in successfully.',
        data: {
            token: result.accessToken,
            role: result.role
        },
    });
});



const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    const result = await AuthService.forgetPasswordToDB(email);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Please check your email, we send a OTP!',
        data: result
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { ...resetData } = req.body;
    const result = await AuthService.resetPasswordToDB(token!, resetData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password reset successfully',
        data: result
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user: any = req.user;
    const { ...passwordData } = req.body;
    await AuthService.changePasswordToDB(user, passwordData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password changed successfully',
    });
});


const newAccessToken = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await AuthService.newAccessTokenToUser(token);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Generate Access Token successfully',
        data: result
    });
});

const resendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.resendVerificationEmailToDB(email);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Generate OTP and send successfully',
        data: result
    });
});

const socialLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.socialLoginFromDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Logged in Successfully',
        data: result
    });
});

// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const result = await AuthService.deleteUserFromDB(req.user, req.body.password);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Account Deleted successfully',
        data: result
    });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email } = req.query;

    const result = await AuthService.getAllUserFromDB(name as string, email as string);

    sendResponse(res, {
        success: true,
        Total: result.length,
        statusCode: StatusCodes.OK,
        message: 'Get All User successfully',
        data: result
    });
});

// get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const user = await req.params.id;
    const result = await AuthService.getSingleUserFromDB(user);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Get Single User successfully',
        data: result
    });
})

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifyOTP(email, otp);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
        data: result.token
    });
});

// ban user from admin
const banUser = catchAsync(async (req: Request, res: Response) => {
    const user = await req.params.id;
    const result = await AuthService.banUserIntoDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User Banned successfully',
        data: result
    });
});


export const AuthController = {
    verifyEmail,
    loginUser,
    forgetPassword,
    resetPassword,
    changePassword,
    newAccessToken,
    resendVerificationEmail,
    socialLogin,
    deleteUser,
    getAllUser,
    getSingleUser,
    verifyOTP,
    banUser,
};