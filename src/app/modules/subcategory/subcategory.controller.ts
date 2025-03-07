import { Request, Response, NextFunction } from 'express';
import { SubcategoryServices } from './subcategory.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';



const createSubCategory = catchAsync(async (req: Request, res: Response) => {
    const result = req.body
    const subCategory = await SubcategoryServices.createSubCategoryIntoDB(result)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully create subcategory",
        data: subCategory
    })
})

// get all category
const getAllSubCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await SubcategoryServices.getAllSubCategoryIntoDB()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All Subcategory retrieve successfully",
        data: result
    })
})


export const SubcategoryController = {
    createSubCategory,
    getAllSubCategory
};
