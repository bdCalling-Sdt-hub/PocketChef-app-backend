import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { CollectionModel, ICollection } from './collection.interface';
import { Collection } from './collection.model';

const createCollectionIntoDB = async (payload: ICollection) => {
    const result = await Collection.create(payload)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create collection")
    }
    return result
}


export const CollectionServices = {
    createCollectionIntoDB
};
