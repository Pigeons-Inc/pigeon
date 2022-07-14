import app from '../src/app';
import request from 'supertest';

describe('GET /ping', () => {
  it('should work fine', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});

describe('GET *', () => {
  it('should return 404', async () => {
    const res = await request(app).get('/adadad');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/*', () => {
  it('should return 500 Internal Server Error if there is no connection to auth service', async () => {
    const res = await request(app).get('/api/asdadads');
    expect(res.status).toBe(500);
  });
});
