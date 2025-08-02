import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './handlers/globalErrorHandler';
import weatherRoutes from './routes/weatherRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(globalErrorHandler);
app.use('/api/weather', weatherRoutes);
app.use(globalErrorHandler);

export default app;
