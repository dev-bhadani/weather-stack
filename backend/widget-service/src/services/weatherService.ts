import axios from 'axios';
import { AppError } from "../handlers/globalErrorHandler";

const WEATHER_SERVICE_BASE_URL = process.env.WEATHER_SERVICE_URL || 'http://localhost:4000/api';

export async function fetchWeather(location: string) {
    try {
        const response = await axios.get(`${WEATHER_SERVICE_BASE_URL}/weather`, {
            params: { location }
        });
        return response.data;
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 400) {
            throw new AppError('Wrong city name entered. Please check and try again.', 400);
        }
        console.error('Weather service error:', err.message);
        throw new AppError('Weather service unavailable', 500);
    }
}
