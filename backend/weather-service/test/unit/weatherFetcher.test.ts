import axios from 'axios';
import {
    fetchWeatherWithCache,
    getCoordinates,
    getWeatherData
} from '../../src/services/weatherFetcher';
import * as cache from '../../src/cache/inMemoryCache';
import { AppError } from '../../src/handlers/globalErrorHandler';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeatherWithCache', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return cached data if available', async () => {
        const cachedWeather = { temperature: 22 };
        jest.spyOn(cache, 'getFromCache').mockReturnValue(cachedWeather);

        const result = await fetchWeatherWithCache('Berlin');
        expect(result).toEqual(cachedWeather);
    });

    it('should fetch from API and cache if not in cache', async () => {
        jest.spyOn(cache, 'getFromCache').mockReturnValue(null);
        const setToCacheSpy = jest.spyOn(cache, 'setToCache').mockImplementation(() => {});

        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('geocoding')) {
                return Promise.resolve({
                    data: {
                        results: [
                            {
                                latitude: 52.52,
                                longitude: 13.41
                            }
                        ]
                    }
                });
            } else if (url.includes('forecast')) {
                return Promise.resolve({
                    data: {
                        current_weather: { temperature: 25 }
                    }
                });
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        const result = await fetchWeatherWithCache('Berlin');
        expect(result).toEqual({ temperature: 25 });
        expect(setToCacheSpy).toHaveBeenCalled();
    });

    it('should throw AppError if location is invalid and no coordinates found', async () => {
        jest.spyOn(cache, 'getFromCache').mockReturnValue(null);
        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('geocoding')) {
                return Promise.resolve({ data: { results: [] } });
            }
            return Promise.reject(new Error('Should not call weather API'));
        });

        await expect(fetchWeatherWithCache('InvalidCity')).rejects.toThrow(
            'Invalid location: "InvalidCity" not found'
        );
    });
});

describe('getCoordinates', () => {
    it('should throw AppError if axios fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
        const call = getCoordinates('Berlin');
        await expect(call).rejects.toThrow(AppError);
        await expect(call).rejects.toThrow('Failed to fetch coordinates');
    });
});

describe('getWeatherData', () => {
    it('should throw AppError if current_weather is missing', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { current_weather: null }
        });

        await expect(getWeatherData(52.52, 13.41)).rejects.toThrow(AppError);
        await expect(getWeatherData(52.52, 13.41)).rejects.toThrow('Failed to fetch weather data');
    });

    it('should throw AppError if axios fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Weather API down'));

        await expect(getWeatherData(52.52, 13.41)).rejects.toThrow(AppError);
        await expect(getWeatherData(52.52, 13.41)).rejects.toThrow('Failed to fetch weather data');
    });
});
