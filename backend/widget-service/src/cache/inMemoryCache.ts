const store = new Map<string, { data: any; timestamp: number }>();

const CACHE_DURATION_MS = 5 * 60 * 1000;

export function getFromCache(key: string): any | null {
    const entry = store.get(key);
    if (!entry) return null;

    const isFresh = Date.now() - entry.timestamp < CACHE_DURATION_MS;
    return isFresh ? entry.data : null;
}

export function setToCache(key: string, data: any): void {
    store.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
    store.clear();
}
