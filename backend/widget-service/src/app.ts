import express from 'express';
import cors from 'cors';
import widgetRoutes from './routes/widgetRoutes';
import { globalErrorHandler } from './handlers/globalErrorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/widgets', widgetRoutes);
app.use(globalErrorHandler);

export default app;
