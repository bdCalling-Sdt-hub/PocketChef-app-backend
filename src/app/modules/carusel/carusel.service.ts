import ApiError from '../../../errors/ApiErrors';
import { CaruselModel, ICarusel } from './carusel.interface';
import { Carusel } from './carusel.model';




const createCaruselIntoDB = async (payload: ICarusel): Promise<ICarusel> => {
    const result = await Carusel.create(payload);
    if (!result) {
        throw new ApiError(400, 'Failed to create carusel');
    }
    return result;
}


const getAllCaruselFromDB = async (): Promise<ICarusel[]> => {
    const result = await Carusel.find();
    return result;
}

const deleteCaruselFromDB = async (id: string) => {
    const result = await Carusel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(400, 'Failed to delete carusel');
    }
    return result;
}

export const CaruselServices = {
    createCaruselIntoDB,
    getAllCaruselFromDB,
    deleteCaruselFromDB
};
