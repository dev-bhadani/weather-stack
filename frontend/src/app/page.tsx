'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AddWidgetForm from '@/components/AddWidgetForm';
import WidgetCard from '@/components/WidgetCard';

import { Widget } from '@/interfaces/widget';
import {
    fetchAllWidgets,
    deleteWidget,
    addWidget,
} from '@/services/widgetService';
import { extractApiErrorMessage } from '@/utils/handleApiError';
import {Sun} from "lucide-react";

export default function Home() {
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWidgets = async () => {
            try {
                const data = await fetchAllWidgets();
                setWidgets(data);
            } catch (error) {
                toast.error('Failed to fetch widgets');
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        void loadWidgets();
    }, []);


    const handleDelete = async (id: string) => {
        try {
            await deleteWidget(id);
            setWidgets((prev) => prev.filter((widget) => widget._id !== id));
        } catch (error) {
            toast.error('Failed to delete widget');
            console.error('Delete error:', error);
        }
    };

    const handleAdd = async (location: string) => {
        try {
            const newWidget = await addWidget(location);
            setWidgets((prev) => [...prev, newWidget]);
            toast.success(`Widget for ${location} added!`);
        } catch (error) {
            const message = extractApiErrorMessage(error);
            toast.error(message);
        }
    };

    return (
        <main className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-500" />
                Weather Widget
            </h1>
            <AddWidgetForm onAdd={handleAdd} />
            {loading ? (
                <p className="mt-4">Loading widgets...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                    {widgets.map((widget) => (
                        <WidgetCard key={widget._id} widget={widget} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </main>
    );
}
