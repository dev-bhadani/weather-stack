import axios from 'axios';
import { Widget } from '@/interfaces/widget';

const BASE_URL = `${process.env.NEXT_PUBLIC_WIDGET_API}/widgets`;

export const fetchAllWidgets = async (): Promise<Widget[]> => {
    const response = await axios.get<Widget[]>(BASE_URL);
    return response.data;
};

export const addWidget = async (location: string): Promise<Widget> => {
    const response = await axios.post(BASE_URL, { location });
    return response.data;
};

export const deleteWidget = async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
};
