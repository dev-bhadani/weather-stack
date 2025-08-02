import axios from 'axios';
import { getFromCache, setToCache } from '../cache/inMemoryCache';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeatherWithCache = async (location: string) => {
    const cached = getFromCache(location);
    if (cached) {
        console.log(`Reading from cache for ${location}`);
        return cached;
    }

    console.log(`Reading from API for ${location}`);
    const res = await axios.get(API_URL, {
        params: {
            latitude: 52.52, // Placeholder coordinates
            longitude: 13.41,
            current_weather: true
        }
    });

    const weather = res.data.current_weather;
    setToCache(location, weather);
    return weather;
};
