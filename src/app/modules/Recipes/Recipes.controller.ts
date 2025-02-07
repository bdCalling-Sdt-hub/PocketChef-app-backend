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


export const RecipeController = {
    createRecipe
}