import { StatusCodes } from 'http-status-codes';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiErrors';

const createAdminToDB = async (payload: IUser): Promise<IUser> => {
    const createAdmin: any = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        await User.findByIdAndUpdate(
            { _id: createAdmin?._id },
            { verified: true },
            { new: true }
        );
    }
    return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
    const isExistAdmin = await User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
    const admins = await User.find({ role: 'ADMIN' })
        .select('name email profile contact location');
    return admins;
};

// get all user from database
interface IFilter {
    filter: 'weekly' | 'monthly' | 'yearly';
}

const getAllNewUser = async (filter: IFilter['filter']): Promise<IUser[]> => {
    let startDate: Date;
    const now = new Date();
    if (filter === 'weekly') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
    } else if (filter === 'monthly') {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
    } else if (filter === 'yearly') {
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid filter type');
    }

    const users = await User.find({ createdAt: { $gte: startDate } });
    if (users.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No new user found');
    }
    return users;
};


// get active user 
interface IActiveUsers {
    period: string;
    count: number;
    users: IUser[];
}

const getActiveUsers = async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<IActiveUsers> => {
    let startDate: Date;
    const now = new Date();

    if (period === 'daily') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 1);
    } else if (period === 'weekly') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'yearly') {
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid period type');
    }

    const users: IUser[] = await User.find({ lastLogin: { $gte: startDate } });

    return {
        period,
        count: users.length,
        users
    };
};

// user ban service single user 
const banUserFromDB = async (id: any): Promise<IUser | undefined> => {
    const isExistUser = await User.findByIdAndUpdate(id, { userBan: true }, { new: true });
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to ban user');
    }
    return isExistUser;
};


export const AdminService = {
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
    getAllNewUser,
    getActiveUsers,
    banUserFromDB
};
