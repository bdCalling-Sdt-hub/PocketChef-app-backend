import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IStripeAccountInfo {
    status: string;
    stripeAccountId: string;
    externalAccountId: string;
    currency: string;
}

interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    id?: string,
    name: string;
    appId: string;
    role: USER_ROLES;
    contact: string;
    email: string;
    password: string;
    confirmPassword: string
    location: string;
    profile: string;
    verified: boolean;
    authentication?: IAuthenticationProps;
    accountInformation?: IStripeAccountInfo;
    userBan?: boolean
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isAccountCreated(id: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;