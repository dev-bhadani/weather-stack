import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('DataBase connected');
        app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('DataBase connection error:', err.message);
        process.exit(1);
    });

app.get('/health', (_req, res) => {
    res.send('OK');
});
