import { Request, Response, NextFunction } from 'express';
import { AddtogroceryServices } from './addtogrocery.service';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';



const addToGrocery = catchAsync(async (req: Request, res: Response) => {
    const { recipe } = req.body;

    // @ts-ignore
    const userId = req.user?.id; // User ID from token

    const result = await AddtogroceryServices.addToGrocery({ recipe, userId });

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Grocery added successfully",
        data: result
    });
});




const getGrocery = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?._id;

    const result = await AddtogroceryServices.getGrocery(userId);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Grocery fetched successfully",
        data: result
    });
});

const updateGrocery = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...updateGroceryData } = req.body;
    const result = await AddtogroceryServices.updateGrocery(id, updateGroceryData);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Grocery updated successfully",
        data: result
    })
});

const deleteGrocery = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AddtogroceryServices.deleteGrocery(id);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Grocery deleted successfully",
        data: result
    })
});


const getGroceryById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AddtogroceryServices.getGroceryById(id);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Grocery fetched successfully",
        data: result
    })
});

const getAllGrocery = catchAsync(async (req: Request, res: Response) => {
    const result = await AddtogroceryServices.getAllGrocery();
    res.status(StatusCodes.OK).json({
        success: true,
        message: "All Grocery fetched successfully",
        data: result
    })
});


export const AddtogroceryController = { addToGrocery, getGrocery, updateGrocery, deleteGrocery, getGroceryById, getAllGrocery };
