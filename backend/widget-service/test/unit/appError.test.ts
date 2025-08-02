import { AppError } from '../../src/handlers/globalErrorHandler';

describe('AppError', () => {
    it('should correctly assign name and statusCode', () => {
        const error = new AppError('Something went wrong', 404);
        expect(error.message).toBe('Something went wrong');
        expect(error.statusCode).toBe(404);
        expect(error.name).toBe('AppError');
    });

    it('should default statusCode to 500 if not provided', () => {
        const error = new AppError('Oops');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('AppError');
    });
});
