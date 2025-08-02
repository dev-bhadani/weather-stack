import { Request, Response, NextFunction } from 'express';
import { fetchWeatherWithCache } from '../services/weatherFetcher';
import { AppError } from '../handlers/globalErrorHandler';

export const getWeather = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const location = req.query.location as string;
    if (!location) {
        return next(new AppError('Location query is required', 400));
    }

    try {
        const weather = await fetchWeatherWithCache(location);
        res.json(weather);
    } catch (err) {
        next(new AppError('Failed to fetch weather data', 500));
    }
};
