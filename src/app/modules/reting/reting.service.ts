import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IReting, RetingModel } from './reting.interface';
import { Reting } from './reting.model';


const createRetingIntoDB = async (payload: { userId: string; star: number; comment: string }) => {
    const result = await Reting.create(payload)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Reting')
    }
    return result
}


export const RetingServices = {
    createRetingIntoDB
};
