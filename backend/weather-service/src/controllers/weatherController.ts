import { Request, Response, NextFunction } from 'express';
import { getCoordinates, getWeatherData } from '../services/weatherFetcher';

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const location = req.query.location as string;
        if (!location) {
            return res.status(400).json({
                error: {
                    name: 'AppError',
                    message: 'Location query is required'
                }
            });
        }
        const coords = await getCoordinates(location);
        if (!coords) {
            return res.status(400).json({
                error: {
                    name: 'AppError',
                    message: 'Wrong city name entered. Please check and try again.'
                }
            });
        }
        const { latitude, longitude } = coords;
        const weather = await getWeatherData(latitude, longitude);
        res.json(weather);
    } catch (err) {
        next(err);
    }
};
