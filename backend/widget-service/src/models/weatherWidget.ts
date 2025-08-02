import { Schema, model } from 'mongoose';

export interface IWidget {
    location: string;
    createdAt: Date;
}

const widgetSchema = new Schema<IWidget>({
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Widget = model<IWidget>('Widget', widgetSchema);

export default Widget;
