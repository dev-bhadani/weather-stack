import {Request, Response, NextFunction} from 'express';

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export const globalErrorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let name = 'InternalServerError';
    let message = 'An unexpected error occurred';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        name = err.name;
        message = err.message;
    } else if (err instanceof Error) {
        name = err.name || name;
        message = err.message || message;
    } else if (typeof err === 'object' && err !== null) {
        try {
            message = `Unexpected error: ${JSON.stringify(err)}`;
        } catch {
            message = 'An unstructured error occurred';
        }
    } else if (typeof err === 'string') {
        message = err;
    }
    res.status(statusCode).json({
        error: {
            name,
            message
        }
    });
};
