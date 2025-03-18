import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiErrors'
import { ICategory } from './category.interface'
import { Category } from './category.model'
import unlinkFile from '../../../shared/unlinkFile'
import { Bookmark } from '../bookmark/bookmark.model'

const createCategoryToDB = async (payload: ICategory) => {
  const { name, category } = payload;
  const isExistName = await Category.findOne({ name: name })

  if (isExistName) {
    unlinkFile(category);
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "This Category Name Already Exist");
  }

  const createCategory: any = await Category.create(payload)
  if (!createCategory) {
    unlinkFile(category);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Category')
  }

  return createCategory
}

const getCategoriesFromDB = async (): Promise<ICategory[]> => {
  const result = await Category.find({})
  return result;
}

const updateCategoryToDB = async (id: string, data: ICategory) => {
  // Check if category exists before updating
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  // Update category in DB
  const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

  // Handle errors if update fails
  if (!updatedCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update Category');
  }

  return updatedCategory;
};


const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
  const deleteCategory = await Category.findByIdAndDelete(id)
  if (!deleteCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist")
  }
  return deleteCategory
}



// get all category
const getAllCategoryFromDB = async () => {
  const result = await Category.find()
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category Not Found")
  }
  return result
}

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
  getAllCategoryFromDB
}
