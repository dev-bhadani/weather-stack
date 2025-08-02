import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

export const globalErrorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(`${err.name}: ${err.message}`);

    const status = err instanceof AppError ? err.statusCode : 500;

    res.status(status).json({
        error: {
            name: err.name,
            message: err.message
        }
    });
};
