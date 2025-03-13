import { Request, Response, NextFunction } from 'express';
import { InstructionsServices } from './instructions.service';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { IPaginationOptions } from '../../../types/pagination';


//create

const createInstruction = catchAsync(async (req: Request, res: Response) => {
    const { ...instructionData } = req.body;
    const result = await InstructionsServices.createInstructionIntoDB(instructionData);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Instruction created successfully',
        data: result
    })
})



// get all instruction
const getAllInstruction = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions: IPaginationOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { data, meta } = await InstructionsServices.getAllInstructionFromDB(paginationOptions);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Instructions fetched successfully",
        Total: meta.total,
        pagination: {
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPage: meta.totalPage
        },
        data
    });
});





// get instruction by id
const getInstructionById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await InstructionsServices.getInstructionByIdFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Instruction fetched successfully',
        data: result
    })
})








export const InstructionsController = {
    createInstruction,
    getAllInstruction,
    getInstructionById
};
