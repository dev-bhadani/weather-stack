import { Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from '../../src/handlers/globalErrorHandler';

describe('globalErrorHandler', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should handle thrown Error objects correctly', () => {
        const error = new Error('Something went wrong');
        globalErrorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'Error',
                message: 'Something went wrong',
            },
        });
    });

    it('should handle thrown non-Error objects gracefully (e.g., string)', () => {
        globalErrorHandler('Some string error' as any, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'InternalServerError',
                message: 'Some string error',
            },
        });
    });

    it('should handle null error objects gracefully', () => {
        globalErrorHandler(null as any, req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'InternalServerError',
                message: 'An unexpected error occurred',
            },
        });
    });

    it('should handle unstructured object errors (stringify failure)', () => {
        const circularObj: any = {};
        circularObj.self = circularObj;
        globalErrorHandler(circularObj, req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'InternalServerError',
                message: 'An unstructured error occurred',
            },
        });
    });


});
