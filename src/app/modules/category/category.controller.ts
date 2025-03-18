import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { CategoryService } from './category.service'
import unlinkFile from '../../../shared/unlinkFile'
import { getSingleFilePath } from '../../../shared/getFilePath'

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const serviceData = req.body;

  const categoryFilePath = getSingleFilePath(req.files, 'category' as any);
  const data = {
    ...serviceData,
    category: categoryFilePath,
  };
  const result = await CategoryService.createCategoryToDB(data)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category create successfully',
    data: result,
  })
})

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: result,
  })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updateCategoryData = req.body;

  const categoryFilePath = getSingleFilePath(req.files, 'category' as any);

  const data = {
    ...updateCategoryData,
    category: categoryFilePath || updateCategoryData.oldCategory,
  };
  try {
    // If a new file is uploaded, remove the old file
    if (categoryFilePath && updateCategoryData.oldCategory) {
      unlinkFile(updateCategoryData.oldCategory);
    }

    const result = await CategoryService.updateCategoryToDB(id, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to update category',
    });
  }
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CategoryService.deleteCategoryToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category delete successfully',
    data: result,
  })
})


// get category
const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategoryFromDB()
  return result
})

export const CategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
  ,
  getAllCategory
}
