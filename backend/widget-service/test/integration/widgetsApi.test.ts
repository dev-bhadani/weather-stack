import mongoose from 'mongoose';
const supertest = require('supertest');
import app from '../../src/app';

const request = supertest(app);

let widgetId: string;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/test-db');
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Widgets API', () => {
    it('POST /api/widgets — creates widget', async () => {
        const res = await request.post('/api/widgets').send({ location: 'Berlin' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('location', 'Berlin');
        expect(res.body).toHaveProperty('weather');
        widgetId = res.body._id;
    });

    it('GET /api/widgets — returns all widgets with weather', async () => {
        const res = await request.get('/api/widgets');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('location');
        expect(res.body[0]).toHaveProperty('weather');
    });

    it('GET /api/widgets/:id — returns specific widget with weather', async () => {
        const res = await request.get(`/api/widgets/${widgetId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('location', 'Berlin');
        expect(res.body).toHaveProperty('weather');
    });

    it('DELETE /api/widgets/:id — deletes widget', async () => {
        const res = await request.delete(`/api/widgets/${widgetId}`);
        expect(res.status).toBe(204);
    });

    it('GET /api/widgets/:id — returns 404 for deleted widget', async () => {
        const res = await request.get(`/api/widgets/${widgetId}`);
        expect(res.status).toBe(404);
    });
});
