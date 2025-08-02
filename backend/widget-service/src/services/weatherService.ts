import axios from 'axios';

const WEATHER_SERVICE_BASE_URL = process.env.WEATHER_SERVICE_URL || 'http://localhost:4000/api';

export async function fetchWeather(location: string) {
    try {
        const response = await axios.get(`${WEATHER_SERVICE_BASE_URL}/weather`, {
            params: { location }
        });
        return response.data;
    } catch (err: any) {
        throw new Error(`Failed to fetch weather: ${err.message}`);
    }
}
