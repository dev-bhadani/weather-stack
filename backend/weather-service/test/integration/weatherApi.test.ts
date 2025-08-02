import request from 'supertest';
import app from '../../src/app';

describe('GET /api/weather', () => {
    it('should return 400 if no location is given', async () => {
        const res = await request(app).get('/api/weather');
        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Location query is required');
        expect(res.body.error.name).toBe('AppError');
    });

    it('should return weather data if location is given', async () => {
        const res = await request(app).get('/api/weather?location=Berlin');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('temperature');
    });
});
