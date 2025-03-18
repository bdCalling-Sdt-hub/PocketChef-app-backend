import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import { config } from "dotenv";
import { jwtHelper } from "../../../helpers/jwtHelper";

const createAdminToDB = async (payload: any): Promise<IUser> => {

    // check admin is exist or not;
    const isExistAdmin = await User.findOne({ email: payload.email })
    if (isExistAdmin) {
        throw new ApiError(StatusCodes.CONFLICT, "This Email already taken");
    }

    // create admin to db
    const createAdmin = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    } else {
        await User.findByIdAndUpdate({ _id: createAdmin?._id }, { verified: true }, { new: true });
    }

    return createAdmin;
}


const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists!');
    }

    // Create the user with verified as false
    const createUser = await User.create({ ...payload, verified: false });
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Generate OTP
    const otp = generateOTP();

    // Email template for account verification
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email!
    };

    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    // Save OTP to the user's authentication object
    const updatedUser = await User.findByIdAndUpdate(createUser._id, {
        authentication: {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60000), // OTP expires in 3 minutes
        }
    }, { new: true });  // Use `new: true` to return the updated document


    return createUser;
};




const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser: any = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
};

const updateProfileToDB = async (user: IUser, updateData: any) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(user.id as any, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating profile');
    }
};


const verifyOtp = async (email: string, otp: number): Promise<boolean> => {
    const user = await User.findOne({ email }).select('authentication'); // Select the authentication field

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    // Check if OTP was generated
    if (!user.authentication || !user.authentication.oneTimeCode) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "OTP not generated!");
    }

    // Check if OTP has expired
    if (new Date() > user.authentication.expireAt) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "OTP has expired!");
    }

    // Check if OTP matches
    if (Number(user.authentication.oneTimeCode) !== Number(otp)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
    }

    // Mark user as verified and clear OTP
    user.verified = true;
    user.authentication = undefined;
    await user.save();

    const token = jwtHelper.createToken(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET as Secret,
        process.env.JWT_EXPIRE_IN as string
    );

    return { message: 'Email verified successfully!', token };
};


export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    createAdminToDB,
    verifyOtp
};