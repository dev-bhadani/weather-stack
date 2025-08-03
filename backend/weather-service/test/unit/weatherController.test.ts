import {Request, Response, NextFunction} from 'express';
import {getWeather} from '../../src/controllers/weatherController';
import * as weatherService from '../../src/services/weatherFetcher';

jest.mock('../../src/services/weatherFetcher');

describe('weatherController.getWeather', () => {
    const mockRequest = (query: any): Partial<Request> => ({query});

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

    it('should return weather data when location is provided and valid', async () => {
        const coords = {latitude: 52.52, longitude: 13.41};
        const weatherData = {temperature: 22};

        (weatherService.getCoordinates as jest.Mock).mockResolvedValue(coords);
        (weatherService.getWeatherData as jest.Mock).mockResolvedValue(weatherData);

        const req = mockRequest({location: 'Berlin'}) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(res.json).toHaveBeenCalledWith(weatherData);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if location is missing', async () => {
        const req = mockRequest({}) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'AppError',
                message: 'Location query is required',
            },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if coordinates are not found', async () => {
        (weatherService.getCoordinates as jest.Mock).mockResolvedValue(null);

        const req = mockRequest({location: 'InvalidCity'}) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: 'AppError',
                message: 'Wrong city name entered. Please check and try again.',
            },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if getWeatherData throws', async () => {
        const coords = {latitude: 52.52, longitude: 13.41};
        (weatherService.getCoordinates as jest.Mock).mockResolvedValue(coords);
        (weatherService.getWeatherData as jest.Mock).mockRejectedValue(new Error('API error'));

        const req = mockRequest({location: 'Berlin'}) as Request;
        const res = mockResponse() as Response;

        await getWeather(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});
