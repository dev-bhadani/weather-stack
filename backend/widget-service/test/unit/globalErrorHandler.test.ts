import { AppError, globalErrorHandler } from '../../src/handlers/globalErrorHandler';
import { Request, Response, NextFunction } from 'express';

describe('globalErrorHandler', () => {
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should handle AppError properly', () => {
        const err = new AppError('Not found', 404);
        const res = mockResponse();
        globalErrorHandler(err, {} as Request, res, {} as NextFunction);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'AppError',
                message: 'Not found'
            }
        });
    });

    it('should handle generic Error as 500', () => {
        const err = new Error('Something broke');
        const res = mockResponse();
        globalErrorHandler(err, {} as Request, res, {} as NextFunction);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'Error',
                message: 'Something broke'
            }
        });
    });
});
