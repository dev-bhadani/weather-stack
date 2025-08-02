import { Request, Response, NextFunction } from 'express';
import Widget from '../models/weatherWidget';
import { AppError } from '../handlers/globalErrorHandler';
import { fetchWeather } from '../services/weatherService';

export const getAllWidgets = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const widgets = await Widget.find().lean();
        const enriched = await Promise.all(
            widgets.map(async (widget) => {
                const weather = await fetchWeather(widget.location);
                return { ...widget, weather };
            })
        );
        res.json(enriched);
    } catch (err) {
        next(err);
    }
};

export const getWidgetById = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params;
        const widget = await Widget.findById(id).lean();
        if (!widget) return next(new AppError('Widget not found', 404));
        const weather = await fetchWeather(widget.location);
        res.json({ ...widget, weather });
    } catch (err) {
        next(err);
    }
};

export const createNewWidget = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { location } = _req.body;
        if (!location) return next(new AppError('Location is required', 400));
        const newWidget = await Widget.create({ location });
        res.status(201).json(newWidget);
    } catch (err) {
        next(err);
    }
};

export const deleteWidgetById = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params;
        const deleted = await Widget.findByIdAndDelete(id);
        if (!deleted) return next(new AppError('Widget not found', 404));
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
