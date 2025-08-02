import axios from 'axios';
import { fetchWeather } from '../../src/services/weatherService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeather', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return weather data on successful request', async () => {
        const fakeWeather = {
            temperature: 22,
            windspeed: 5,
            weathercode: 1,
            time: '2025-08-02T11:00',
        };

        mockedAxios.get.mockResolvedValueOnce({ data: fakeWeather });

        const result = await fetchWeather('Berlin');

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:4000/api/weather',
            { params: { location: 'Berlin' } }
        );

        expect(result).toEqual(fakeWeather);
    });

    it('should throw an error if the request fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Service unavailable'));

        await expect(fetchWeather('Berlin')).rejects.toThrow(
            'Failed to fetch weather: Service unavailable'
        );
    });
});
