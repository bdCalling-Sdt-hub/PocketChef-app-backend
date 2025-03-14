import { Request, Response, NextFunction } from 'express';
import { IngredientsServices } from './ingredients.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';




const createIngredients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...ingredientsData } = req.body;
    const result = await IngredientsServices.createIngredientsIntoDB(ingredientsData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ingredients created successfully",
        data: result
    })
});


const getAllIngredients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await IngredientsServices.getAllIngredientsFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ingredients fetched successfully",
        data: result
    })
});


const getSingleIngredients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await IngredientsServices.getSingleIngredientsFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ingredients fetched successfully",
        data: result
    })
});

const updateIngredients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ...ingredientsData } = req.body;
    const result = await IngredientsServices.updateIngredientsIntoDB(id, ingredientsData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ingredients updated successfully",
        data: result
    })
});

const deleteIngredients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await IngredientsServices.deleteIngredientsFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ingredients deleted successfully",
        data: result
    })
});


export const IngredientsController = { createIngredients, getAllIngredients, getSingleIngredients, updateIngredients, deleteIngredients };
