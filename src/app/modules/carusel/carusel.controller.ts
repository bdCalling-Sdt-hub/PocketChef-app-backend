import { Request, Response, NextFunction } from 'express';
import { CaruselServices } from './carusel.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';






const createCarusel = catchAsync(async (req: Request, res: Response) => {
    const { ...caruselData } = req.body;
    const result = await CaruselServices.createCaruselIntoDB(caruselData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Carusel created successfully',
        data: result
    })

});


const getAllCarusel = catchAsync(async (req: Request, res: Response) => {
    const result = await CaruselServices.getAllCaruselFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Carusel fetched successfully',
        data: result
    })
});


const deleteCarusel = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CaruselServices.deleteCaruselFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Carusel deleted successfully',
        data: result
    })
});


export const CaruselController = {
    createCarusel,
    getAllCarusel,
    deleteCarusel
};
