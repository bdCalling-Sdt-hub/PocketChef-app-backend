import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISubcategory } from "./subcategory.interface";
import { Subcategory } from "./subcategory.model";
import { Category } from "../category/category.model";



const createSubCategoryIntoDB = async (payload: ISubcategory) => {
    try {
        if (!payload.category) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Category ID is required");
        }

        const category = await Category.findById(payload.category);
        if (!category) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "No category found with this ID");
        }

        const subcategory = await Subcategory.create(payload);
        if (!subcategory) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create subcategory");
        }

        return subcategory;
    } catch (error) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create subcategory");
    }
};


const getAllSubCategoryIntoDB = async () => {
    const result = await Subcategory.find().populate("category")
    if (!result) {
        return []
    }
    return result
}



// delete subcategory
const deleteSubcategoryToDB = async (id: string) => {
    const deleteSubcategory = await Subcategory.findByIdAndDelete(id)
    if (!deleteSubcategory) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Subcategory not found")
    }
    return deleteSubcategory
}



// update subcategory
const updateSubcategoryToDB = async (id: string, payload: ISubcategory) => {
    const updateSubcategory = await Subcategory.findByIdAndUpdate(id, payload, { new: true })
    if (!updateSubcategory) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Subcategory not found")
    }
    return updateSubcategory
}


export const SubcategoryServices = {
    createSubCategoryIntoDB,
    getAllSubCategoryIntoDB,
    deleteSubcategoryToDB,
    updateSubcategoryToDB
};
