import { getFromCache, setToCache } from '../../src/cache/inMemoryCache';

describe('inMemoryCache', () => {
    const key = 'Berlin';
    const weatherData = { temperature: 22 };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return cached data if not expired', () => {
        setToCache(key, weatherData);
        const result = getFromCache(key);
        expect(result).toEqual(weatherData);
    });

    it('should return null if cache is expired', () => {
        setToCache(key, weatherData);
        jest.advanceTimersByTime(5 * 60 * 1000 + 1);
        const result = getFromCache(key);
        expect(result).toBeNull();
    });

    it('should return null if key is not found', () => {
        const result = getFromCache('nonexistent');
        expect(result).toBeNull();
    });
});
