import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IPrivacyandpolicy, PrivacyandpolicyModel } from './privacyandpolicy.interface';
import { Privacyandpolicy } from './privacyandpolicy.model';


const createPrivacyandpolicyIntoDB = async (payload: IPrivacyandpolicy): Promise<IPrivacyandpolicy> => {
    await Privacyandpolicy.deleteMany({});
    const result = await Privacyandpolicy.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create privacy and policy");
    }
    return result;
}

const getAllPrivacyandpolicyFromDB = async (): Promise<IPrivacyandpolicy[]> => {
    const result = await Privacyandpolicy.find();
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get privacy and policy");
    }
    return result;
}

export const PrivacyandpolicyServices = {
    createPrivacyandpolicyIntoDB,
    getAllPrivacyandpolicyFromDB
};
