export interface WeatherData {
    temperature: number;
    windspeed: number;
    weathercode: number;
}

export interface Widget {
    _id: string;
    location: string;
    createdAt: string;
    weather?: WeatherData;
}
