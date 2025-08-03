import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get('/health', (_req, res) => {
    res.send('OK');
});

app.listen(PORT, () => {
    console.log(`Weather Service running at http://localhost:${PORT}`);
});
