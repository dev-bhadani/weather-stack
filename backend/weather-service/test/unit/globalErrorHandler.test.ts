import { AppError, globalErrorHandler } from '../../src/handlers/globalErrorHandler';
import { Request, Response, NextFunction } from 'express';

describe('globalErrorHandler', () => {
    const req = {} as Request;

    const mockResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    const next = jest.fn() as NextFunction;

    it('should handle AppError with custom status', () => {
        const res = mockResponse();
        const err = new AppError('Not found', 404);

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'AppError',
                message: 'Not found'
            }
        });
    });

    it('should handle generic Error with 500 status', () => {
        const res = mockResponse();
        const err = new Error('Something broke');

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'Error',
                message: 'Something broke'
            }
        });
    });

    it('should handle thrown non-Error objects gracefully', () => {
        const res = mockResponse();
        const err = 'unexpected error' as unknown as Error;

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: undefined,
                message: undefined
            }
        });
    });
});
