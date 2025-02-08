import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RecipeService } from "./Recipes.service";

const createRecipe = catchAsync(async (req: Request, res: Response) => {
    // const result = await NotificationService.getNotificationFromDB(user);
    const recipeData = req.body;

    const result = await RecipeService.createRecipeIntoDB(recipeData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recipes create Successfully',
        data: result,
    });
}
);
// update recipe for 
const updateRecipe = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const recipeData = req.body;

    // Pass the files directly from the request to the service
    const updatedRecipe = await RecipeService.updateRecipeIntoDB(id, recipeData, req?.files);

    // Send the response with the updated recipe
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recipe updated successfully',
        data: updatedRecipe,
    });
});




export const RecipeController = {
    createRecipe,
    updateRecipe
}