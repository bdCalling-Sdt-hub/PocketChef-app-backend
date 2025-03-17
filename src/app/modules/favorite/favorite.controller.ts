import { Request, Response, NextFunction } from 'express';
import { FavoriteServices } from './favorite.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { JwtPayload } from 'jsonwebtoken';


const createFavorite = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = (req.user as JwtPayload)?.id;

    const favoriteData = {
        ...req.body,
        userId
    };
    console.log("favoriteData", favoriteData);
    const result = await FavoriteServices.createFavoriteIntoDB(favoriteData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite created successfully',
        data: result
    })
})

const getAllFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const result = await FavoriteServices.getAllFavoriteIntoDB(userId)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite fetched successfully',
        data: result
    })
})

const getSingleFavorite = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await FavoriteServices.getSingleFavoriteIntoDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite fetched successfully',
        data: result
    })
})

const updateFavorite = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const favorite = req.body
    const result = await FavoriteServices.updateFavoriteIntoDB(id, favorite)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite updated successfully',
        data: result
    })
})

const deleteFavorite = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await FavoriteServices.deleteFavoriteIntoDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Favorite deleted successfully',
        data: result
    })
})

export const FavoriteController = { createFavorite, getAllFavorite, getSingleFavorite, updateFavorite, deleteFavorite };
