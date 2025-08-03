import axios from 'axios';
import { fetchWeather } from '../../src/services/weatherService';
import { AppError } from '../../src/handlers/globalErrorHandler';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeather', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return weather data when successful', async () => {
        const weatherData = {
            temperature: 25,
            windspeed: 10,
            winddirection: 90,
            weathercode: 2,
            is_day: 1,
            time: '2025-08-03T10:00',
        };

        mockedAxios.get.mockResolvedValueOnce({ data: weatherData });

        const result = await fetchWeather('Berlin');
        expect(result).toEqual(weatherData);
    });

    it('should throw an AppError if axios fails with other errors', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Service unavailable'));

        await expect(fetchWeather('Berlin')).rejects.toThrow(AppError);
        await expect(fetchWeather('Berlin')).rejects.toThrow('Weather service unavailable');
    });
});
