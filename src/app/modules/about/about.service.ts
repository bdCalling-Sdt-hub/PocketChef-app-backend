import ApiError from '../../../errors/ApiErrors';
import { AboutModel, IAbout } from './about.interface';
import { About } from './about.model';
import { StatusCodes } from 'http-status-codes';

const createAboutIntoDB = async (payload: IAbout): Promise<IAbout> => {
    await About.deleteMany({})
    const result = await About.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create about");
    }
    return result;
}

const getAllAboutFromDB = async (): Promise<IAbout[]> => {
    const result = await About.find();
    return result;
}

export const AboutServices = {
    createAboutIntoDB,
    getAllAboutFromDB
};
