import { Response } from 'express';

type IData<T> = {
    success: boolean;
    Total?: number;
    statusCode: number;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        totalPage: number;
        total: number;
    };
    data?: T;
};

const sendResponse = <T>(res: Response, data: IData<T>) => {
    const resData = {
        success: data.success,
        Total: Array.isArray(data.data) ? data.data.length : undefined,
        message: data.message,
        pagination: data.pagination,
        data: data.data,
    };
    if (data.pagination) {
        // Calculate total pages based on total count and limit
        const totalPage = Math.ceil(data.pagination.total / data.pagination.limit);
        // @ts-ignore
        resData?.pagination?.totalPage = totalPage;
    }
    res.status(data.statusCode).json(resData);
};

export default sendResponse;
