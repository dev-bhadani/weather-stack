const store = new Map<string, { data: any; timestamp: number }>();

export const getFromCache = (key: string): any | null => {
    const entry = store.get(key);
    if (entry && Date.now() - entry.timestamp < 5 * 60 * 1000) {
        return entry.data;
    }
    return null;
};

export const setToCache = (key: string, data: any): void => {
    store.set(key, { data, timestamp: Date.now() });
};
