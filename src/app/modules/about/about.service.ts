import { AboutModel, IAbout } from './about.interface';
import { About } from './about.model';


const createAboutIntoDB = async (payload: IAbout): Promise<IAbout> => {
    const result = await About.create(payload);
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
