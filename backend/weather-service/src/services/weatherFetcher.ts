import axios from 'axios';
import { AppError } from '../handlers/globalErrorHandler';
import {getFromCache, setToCache} from "../cache/inMemoryCache";

export const getCoordinates = async (location: string) => {
    try {
        const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: { name: location },
        });
        const data = res.data;
        if (!data.results || data.results.length === 0) {
            return null;
        }
        const { latitude, longitude } = data.results[0];
        return { latitude, longitude };
    } catch (err) {
        throw new AppError('Failed to fetch coordinates', 500);
    }
};

export const getWeatherData = async (latitude: number, longitude: number) => {
    try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current_weather: true,
            },
        });
        const current = res.data.current_weather;
        if (!current) {
            throw new AppError('Failed to fetch weather data', 500);
        }
        return {
            time: current.time,
            temperature: current.temperature,
            windspeed: current.windspeed,
            winddirection: current.winddirection,
            weathercode: current.weathercode,
            is_day: current.is_day,
        };
    } catch (err) {
        throw new AppError('Failed to fetch weather data', 500);
    }
};

export const fetchWeatherWithCache = async (location: string) => {
    const cached = getFromCache(location);
    if (cached) {
        return cached;
    }
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
        throw new AppError(`Invalid location: "${location}" not found`, 400);
    }
    const weather = await getWeatherData(coordinates.latitude, coordinates.longitude);
    setToCache(location, weather);
    return weather;
};
