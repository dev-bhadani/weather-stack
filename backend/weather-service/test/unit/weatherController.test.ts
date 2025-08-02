import { Request, Response, NextFunction } from 'express';
import { getWeather } from '../../src/controllers/weatherController';
import * as weatherService from '../../src/services/weatherFetcher';
import { AppError } from '../../src/handlers/globalErrorHandler';

jest.mock('../../src/services/weatherFetcher');

describe('weatherController.getWeather', () => {
    const mockRequest = (query: any): Partial<Request> => ({ query });

    const mockResponse = (): Partial<Response> => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    let mockNext: jest.MockedFunction<NextFunction>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockNext = jest.fn();
    });

    it('should return weather data when location is provided', async () => {
        const weatherData = { temperature: 22 };
        (weatherService.fetchWeatherWithCache as jest.Mock).mockResolvedValue(weatherData);

        const req = mockRequest({ location: 'Berlin' }) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(res.json).toHaveBeenCalledWith(weatherData);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with 400 AppError if location is missing', async () => {
        const req = mockRequest({}) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));

        const error = mockNext.mock.calls[0][0] as unknown as AppError;
        expect(error.message).toBe('Location query is required');
        expect(error.statusCode).toBe(400);
    });

    it('should call next with 500 AppError if weather fetch fails', async () => {
        (weatherService.fetchWeatherWithCache as jest.Mock).mockRejectedValue(new Error('API error'));

        const req = mockRequest({ location: 'Berlin' }) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));

        const error = mockNext.mock.calls[0][0] as unknown as AppError;
        expect(error.message).toBe('Failed to fetch weather data');
        expect(error.statusCode).toBe(500);
    });
});
