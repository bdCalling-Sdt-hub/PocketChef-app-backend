import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { Addtogrocery } from './addtogrocery.model';
import { IAddtogrocery } from './addtogrocery.interface';

const addToGrocery = async (payload: IAddtogrocery) => {
    const result = await Addtogrocery.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Can't add Grocery");
    }
    return result;
};



const getGrocery = async (user: string) => {
    const result = await Addtogrocery.find({ user }).populate('recipe');
    return result;
};


const updateGrocery = async (id: string, payload: Partial<IAddtogrocery>) => {
    const result = await Addtogrocery.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Can't update Grocery");
    }
    return result;
};

const deleteGrocery = async (id: string) => {
    const result = await Addtogrocery.findByIdAndDelete(id);
    return result;
}

const getGroceryById = async (id: string) => {

    const result = await Addtogrocery.findById(id).populate('recipe');
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Can't find Grocery");
    }
    return result;
}

const getAllGrocery = async () => {
    const result = await Addtogrocery.find().populate('recipe');
    return result;
}
export const AddtogroceryServices = { addToGrocery, getGrocery, updateGrocery, deleteGrocery, getGroceryById, getAllGrocery };
