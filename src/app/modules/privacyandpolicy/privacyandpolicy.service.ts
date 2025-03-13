import { IPrivacyandpolicy, PrivacyandpolicyModel } from './privacyandpolicy.interface';
import { Privacyandpolicy } from './privacyandpolicy.model';


const createPrivacyandpolicyIntoDB = async (payload: IPrivacyandpolicy): Promise<IPrivacyandpolicy> => {
    const result = await Privacyandpolicy.create(payload);
    return result;
}

const getAllPrivacyandpolicyFromDB = async (): Promise<IPrivacyandpolicy[]> => {
    const result = await Privacyandpolicy.find();
    return result;
}

export const PrivacyandpolicyServices = {
    createPrivacyandpolicyIntoDB,
    getAllPrivacyandpolicyFromDB
};
