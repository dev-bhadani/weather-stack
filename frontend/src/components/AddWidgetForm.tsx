'use client';
import { useState } from 'react';

interface AddWidgetFormProps {
    onAdd: (location: string) => void;
}

export default function AddWidgetForm({ onAdd }: AddWidgetFormProps) {
    const [location, setLocation] = useState('');

    const handleAdd = async () => {
        if (!location.trim()) return;
        onAdd(location);
        setLocation('');
    };

    return (
        <div className="flex gap-2 w-full max-w-xl">
            <input
                type="text"
                placeholder="Enter city name..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Add Widget
            </button>
        </div>
    );
}
