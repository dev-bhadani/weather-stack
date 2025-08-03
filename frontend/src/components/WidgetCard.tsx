import { Widget } from '@/interfaces/widget';
import { Trash2, ThermometerSun, Wind, CloudSun } from 'lucide-react';

interface WidgetCardProps {
    widget: Widget;
    onDelete: (id: string) => void;
}

export default function WidgetCard({ widget, onDelete }: WidgetCardProps) {
    const { _id, location, createdAt, weather } = widget;

    return (
        <div className="min-w-[300px] max-w-[300px] bg-white shadow-md rounded-xl p-4 border border-gray-200 flex-shrink-0 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold">{location}</h2>
                    <p className="text-sm text-gray-500">Created: {new Date(createdAt).toLocaleString()}</p>
                </div>
                <button
                    onClick={() => onDelete(_id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {weather ? (
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-yellow-500" />
                        <span><strong>Temperature:</strong> {weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-blue-500" />
                        <span><strong>Wind Speed:</strong> {weather.windspeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CloudSun className="w-4 h-4 text-gray-600" />
                        <span><strong>Weather Code:</strong> {weather.weathercode}</span>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-sm text-gray-400 italic">Weather data unavailable</p>
            )}
        </div>
    );
}
