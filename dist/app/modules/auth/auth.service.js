"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const resetToken_model_1 = require("../resetToken/resetToken.model");
const user_model_1 = require("../user/user.model");
//login
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // Clean email input
    const cleanedEmail = email.trim().toLowerCase();
    // Find the user by email and include password
    const isExistUser = yield user_model_1.User.findOne({ email: cleanedEmail }).select('+password +verified');
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Check if user is verified
    if (!isExistUser.verified) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please verify your account before logging in');
    }
    // Check user status (if user is deactivated)
    if (isExistUser.status === 'delete') {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content. It looks like your account has been deactivated.');
    }
    // Check if the password matches
    const passwordMatch = yield bcrypt_1.default.compare(password, isExistUser.password);
    if (!passwordMatch) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }
    // Create tokens if login is successful
    const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in || '1h');
    const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwtRefreshSecret, config_1.default.jwt.jwtRefreshExpiresIn || '7d');
    return {
        accessToken, refreshToken,
        role: isExistUser.role,
    };
});
//forget password
const forgetPasswordToDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserByEmail(email);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email
    };
    const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
    emailHelper_1.emailHelper.sendEmail(forgetPassword);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000)
    };
    yield user_model_1.User.findOneAndUpdate({ email }, { $set: { authentication } });
});
//verify email
const verifyEmailToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, oneTimeCode } = payload;
    // Find the user and check if the OTP exists
    const isExistUser = yield user_model_1.User.findOne({ email }).select('+authentication');
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!oneTimeCode) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
    }
    // Check if the provided OTP matches the stored OTP
    if (((_a = isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== oneTimeCode) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }
    const date = new Date();
    if (date > ((_b = isExistUser.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP has expired, please try again');
    }
    // If OTP is valid, mark the user as verified and clear OTP
    yield user_model_1.User.findByIdAndUpdate(isExistUser._id, {
        verified: true,
        authentication: { oneTimeCode: null, expireAt: null }
    });
    return { message: 'Email verified successfully!' };
});
//forget password
const resetPasswordToDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword, confirmPassword } = payload;
    //isExist token
    const isExistToken = yield resetToken_model_1.ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    //user permission check
    const isExistUser = yield user_model_1.User.findById(isExistToken.user).select('+authentication');
    if (!((_a = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.isResetPassword)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    //validity check
    const isValid = yield resetToken_model_1.ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }
    //check password
    if (newPassword !== confirmPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        }
    };
    yield user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, { new: true });
});
const changePasswordToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = yield user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //current password match
    if (currentPassword && !(yield user_model_1.User.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    //newPassword and current password
    if (currentPassword === newPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give different password from current password');
    }
    //new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }
    //hash password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
    };
    yield user_model_1.User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
});
const newAccessTokenToUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the token is provided
    if (!token) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token is required!');
    }
    const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwtRefreshSecret);
    const isExistUser = yield user_model_1.User.findById(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return { accessToken };
});
const resendVerificationEmailToDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by ID
    const existingUser = yield user_model_1.User.findOne({ email: email }).lean();
    if (!existingUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User with this email does not exist!');
    }
    if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isVerified) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is already verified!');
    }
    // Generate OTP and prepare email
    const otp = (0, generateOTP_1.default)();
    const emailValues = {
        name: existingUser.firstName,
        otp,
        email: existingUser.email,
    };
    const accountEmailTemplate = emailTemplate_1.emailTemplate.createAccount(emailValues);
    emailHelper_1.emailHelper.sendEmail(accountEmailTemplate);
    // Update user with authentication details
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ email: email }, { $set: { authentication } }, { new: true });
});
// social authentication
const socialLoginFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { appId, role } = payload;
    const isExistUser = yield user_model_1.User.findOne({ appId });
    if (isExistUser) {
        //create token
        const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        //create token
        const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role }, config_1.default.jwt.jwtRefreshSecret, config_1.default.jwt.jwtRefreshExpiresIn);
        return { accessToken, refreshToken };
    }
    else {
        const user = yield user_model_1.User.create({ appId, role, verified: true });
        if (!user) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to created User");
        }
        //create token
        const accessToken = jwtHelper_1.jwtHelper.createToken({ id: user._id, role: user.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        //create token
        const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: user._id, role: user.role }, config_1.default.jwt.jwtRefreshSecret, config_1.default.jwt.jwtRefreshExpiresIn);
        return { accessToken, refreshToken };
    }
});
// delete user
// delete user
const deleteUserFromDB = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //check match password
    if (password && !(yield user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    const updateUser = yield user_model_1.User.findByIdAndDelete(user.id);
    if (!updateUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return;
});
// get all user
const getAllUserFromDB = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
        filter.email = { $regex: email, $options: "i" };
    }
    const result = yield user_model_1.User.find(filter);
    if (!result || result.length === 0) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No user found");
    }
    return result;
});
// single user get
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
});
// otp verification
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ email }).select('+authentication');
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!otp) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
    }
    if (((_a = user.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== otp) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }
    const date = new Date();
    if (date > ((_b = user.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP has expired, please try again');
    }
    // Update user verification status and remove OTP
    yield user_model_1.User.findOneAndUpdate({ _id: user._id }, { verified: true, authentication: { oneTimeCode: null, expireAt: null } });
    return { message: 'Email verified successfully!' };
});
// ban user from admin account 
const banUserIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield user_model_1.User.findByIdAndUpdate(user);
    if (!userId) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(user, { userBan: true });
    return result;
});
exports.AuthService = {
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
    verifyOTP,
    banUserIntoDB
};
