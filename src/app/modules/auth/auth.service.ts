import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiErrors';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
    IAuthResetPassword,
    IChangePassword,
    ILoginData,
    IVerifyEmail
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { ResetToken } from '../resetToken/resetToken.model';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';

//login
const loginUserFromDB = async (payload: ILoginData) => {
    const { email, password } = payload;


    // Clean email input
    const cleanedEmail = email.trim().toLowerCase();

    // Find the user by email and include password
    const isExistUser = await User.findOne({ email: cleanedEmail }).select('+password +verified');
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }


    // Check if user is verified
    if (!isExistUser.verified) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Please verify your account before logging in');
    }

    // Check user status (if user is deactivated)
    if (isExistUser.status === 'delete') {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'You don’t have permission to access this content. It looks like your account has been deactivated.'
        );
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, isExistUser.password);
    if (!passwordMatch) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }

    // Create tokens if login is successful
    const accessToken = jwtHelper.createToken(
        { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
        config.jwt.jwt_secret as Secret,
        config.jwt.jwt_expire_in || '1h'
    );

    const refreshToken = jwtHelper.createToken(
        { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
        config.jwt.jwtRefreshSecret as Secret,
        (config.jwt.jwtRefreshExpiresIn as string) || '7d'
    );

    return {
        accessToken, refreshToken,
        role: isExistUser.role,
    };
};


//forget password
const forgetPasswordToDB = async (email: string) => {

    const isExistUser = await User.isExistUserByEmail(email);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //send mail
    const otp = generateOTP();
    const value = {
        otp,
        email: isExistUser.email
    };

    const forgetPassword = emailTemplate.resetPassword(value);
    emailHelper.sendEmail(forgetPassword);

    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000)
    };
    await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
    const { email, oneTimeCode } = payload;


    // Find the user and check if the OTP exists
    const isExistUser = await User.findOne({ email }).select('+authentication');
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    if (!oneTimeCode) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
    }

    // Check if the provided OTP matches the stored OTP
    if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    const date = new Date();
    if (date > isExistUser.authentication?.expireAt) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP has expired, please try again');
    }

    // If OTP is valid, mark the user as verified and clear OTP
    await User.findByIdAndUpdate(isExistUser._id, {
        verified: true,
        authentication: { oneTimeCode: null, expireAt: null }
    });

    return { message: 'Email verified successfully!' };
};



//forget password
const resetPasswordToDB = async (token: string, payload: IAuthResetPassword) => {

    const { newPassword, confirmPassword } = payload;

    //isExist token
    const isExistToken = await ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }

    //user permission check
    const isExistUser = await User.findById(isExistToken.user).select('+authentication');
    if (!isExistUser?.authentication?.isResetPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }

    //validity check
    const isValid = await ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }

    //check password
    if (newPassword !== confirmPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }

    const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        }
    };

    await User.findOneAndUpdate(
        { _id: isExistToken.user },
        updateData,
        { new: true }
    );
};

const changePasswordToDB = async (user: JwtPayload, payload: IChangePassword) => {

    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = await User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //current password match
    if (currentPassword && !(await User.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }

    //newPassword and current password
    if (currentPassword === newPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Please give different password from current password');
    }

    //new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }

    //hash password
    const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

    const updateData = {
        password: hashPassword,
    };

    await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};


const newAccessTokenToUser = async (token: string) => {

    // Check if the token is provided
    if (!token) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Token is required!');
    }

    const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwtRefreshSecret as Secret
    );

    const isExistUser = await User.findById(verifyUser?.id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access")
    }

    //create token
    const accessToken = jwtHelper.createToken(
        { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
        config.jwt.jwt_secret as Secret,
        config.jwt.jwt_expire_in as string
    );

    return { accessToken }
}

const resendVerificationEmailToDB = async (email: string) => {

    // Find the user by ID
    const existingUser: any = await User.findOne({ email: email }).lean();

    if (!existingUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User with this email does not exist!',);
    }

    if (existingUser?.isVerified) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already verified!');
    }

    // Generate OTP and prepare email
    const otp = generateOTP();
    const emailValues = {
        name: existingUser.firstName,
        otp,
        email: existingUser.email,
    };

    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };

    await User.findOneAndUpdate(
        { email: email },
        { $set: { authentication } },
        { new: true }
    );


};

// social authentication
const socialLoginFromDB = async (payload: IUser) => {

    const { appId, role } = payload;

    const isExistUser = await User.findOne({ appId });

    if (isExistUser) {

        //create token
        const accessToken = jwtHelper.createToken(
            { id: isExistUser._id, role: isExistUser.role },
            config.jwt.jwt_secret as Secret,
            config.jwt.jwt_expire_in as string
        );

        //create token
        const refreshToken = jwtHelper.createToken(
            { id: isExistUser._id, role: isExistUser.role },
            config.jwt.jwtRefreshSecret as Secret,
            config.jwt.jwtRefreshExpiresIn as string
        );

        return { accessToken, refreshToken };

    } else {

        const user = await User.create({ appId, role, verified: true });
        if (!user) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created User")
        }

        //create token
        const accessToken = jwtHelper.createToken(
            { id: user._id, role: user.role },
            config.jwt.jwt_secret as Secret,
            config.jwt.jwt_expire_in as string
        );

        //create token
        const refreshToken = jwtHelper.createToken(
            { id: user._id, role: user.role },
            config.jwt.jwtRefreshSecret as Secret,
            config.jwt.jwtRefreshExpiresIn as string
        );

        return { accessToken, refreshToken };
    }
}

// delete user
// delete user
const deleteUserFromDB = async (user: JwtPayload, password: string) => {

    const isExistUser = await User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //check match password
    if (password && !(await User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }

    const updateUser = await User.findByIdAndDelete(user.id);
    if (!updateUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return;
};
// get all user
const getAllUserFromDB = async (name?: string, email?: string) => {
    let filter: any = {};

    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
        filter.email = { $regex: email, $options: "i" };
    }

    const result = await User.find(filter);

    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }
    return result;
};



// single user get
const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
}

// otp verification
const verifyOTP = async (email, otp) => {
    const user = await User.findOne({ email }).select('+authentication');

    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    if (!otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
    }

    if (user.authentication?.oneTimeCode !== otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    const date = new Date();
    if (date > user.authentication?.expireAt) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP has expired, please try again');
    }

    // Update user verification status and remove OTP
    await User.findOneAndUpdate(
        { _id: user._id },
        { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );

    return { message: 'Email verified successfully!' };
};


export const AuthService = {
    verifyEmailToDB,
    loginUserFromDB,
    forgetPasswordToDB,
    resetPasswordToDB,
    changePasswordToDB,
    newAccessTokenToUser,
    resendVerificationEmailToDB,
    socialLoginFromDB,
    deleteUserFromDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    verifyOTP
};