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
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const emailTemplate_1 = require("../../../shared/emailTemplate");
const emailHelper_1 = require("../../../helpers/emailHelper");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check admin is exist or not;
    const isExistAdmin = yield user_model_1.User.findOne({ email: payload.email });
    if (isExistAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This Email already taken");
    }
    // create admin to db
    const createAdmin = yield user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    else {
        yield user_model_1.User.findByIdAndUpdate({ _id: createAdmin === null || createAdmin === void 0 ? void 0 : createAdmin._id }, { verified: true }, { new: true });
    }
    return createAdmin;
});
// const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
//     const createUser = await User.create(payload);
//     if (!createUser) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
//     }
//     //send email
//     const otp = generateOTP();
//     const values = {
//         name: createUser.name,
//         otp: otp,
//         email: createUser.email!
//     };
//     const createAccountTemplate = emailTemplate.createAccount(values);
//     emailHelper.sendEmail(createAccountTemplate);
//     //save to DB
//     const authentication = {
//         oneTimeCode: otp,
//         expireAt: new Date(Date.now() + 3 * 60000),
//     };
//     await User.findOneAndUpdate(
//         { _id: createUser._id },
//         { $set: { authentication } }
//     );
//     return createUser;
// };
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the email already exists
    const existingUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists!');
    }
    // Create the user with verified as false
    const createUser = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { verified: false }));
    if (!createUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    // Generate OTP
    const otp = (0, generateOTP_1.default)();
    // Email template for account verification
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    // Save OTP to the user's authentication object
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(createUser._id, {
        authentication: {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60000), // OTP expires in 3 minutes
        }
    }, { new: true }); // Use `new: true` to return the updated document
    return createUser;
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profile) {
        (0, unlinkFile_1.default)(isExistUser.profile);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, { new: true });
    return updateDoc;
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('authentication'); // Select the authentication field
    if (!user) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    // Check if OTP was generated
    if (!user.authentication || !user.authentication.oneTimeCode) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP not generated!");
    }
    // Check if OTP has expired
    if (new Date() > user.authentication.expireAt) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP has expired!");
    }
    // Check if OTP matches
    if (Number(user.authentication.oneTimeCode) !== Number(otp)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid OTP!");
    }
    // Mark user as verified and clear OTP
    user.verified = true;
    user.authentication = undefined;
    yield user.save();
    return true;
});
exports.UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    createAdminToDB,
    verifyOtp
};
