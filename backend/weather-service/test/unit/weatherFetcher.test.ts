import axios from 'axios';
import * as cache from '../../src/cache/inMemoryCache';
import { fetchWeatherWithCache } from '../../src/services/weatherFetcher';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeatherWithCache', () => {
    const location = 'Berlin';
    const fakeWeather = { temperature: 25 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return data from cache if available', async () => {
        jest.spyOn(cache, 'getFromCache').mockReturnValue(fakeWeather);

        const result = await fetchWeatherWithCache(location);
        expect(result).toEqual(fakeWeather);
    });

    it('should fetch from API and cache if not in cache', async () => {
        jest.spyOn(cache, 'getFromCache').mockReturnValue(null);
        const setSpy = jest.spyOn(cache, 'setToCache').mockImplementation(() => {});

        mockedAxios.get.mockResolvedValue({
            data: { current_weather: fakeWeather }
        });

        const result = await fetchWeatherWithCache(location);
        expect(mockedAxios.get).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith(location, fakeWeather);
        expect(result).toEqual(fakeWeather);
    });
});
