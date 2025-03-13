import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IInstructions } from './instructions.interface';
import { InstructionsModel } from './instructions.model';
import { IPaginationOptions } from '../../../types/pagination';
import { calculatePagination, paginationHelper } from '../../../helpers/paginationHelper';


// create instruction into db
const createInstructionIntoDB = async (payload: IInstructions) => {
    const result = await InstructionsModel.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create instruction")
    }
    return result;
}


// get all instruction from db
const getAllInstructionFromDB = async (options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const total = await InstructionsModel.countDocuments();
    const totalPage = Math.ceil(total / limit);

    const data = await InstructionsModel.find()
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage
        },
    };
};




// get instruction by id
const getInstructionByIdFromDB = async (id: string): Promise<IInstructions | null> => {
    const result = await InstructionsModel.findById(id);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Instruction not found")
    }
    return result;
}


export const InstructionsServices = {
    createInstructionIntoDB,
    getAllInstructionFromDB,
    getInstructionByIdFromDB
};
