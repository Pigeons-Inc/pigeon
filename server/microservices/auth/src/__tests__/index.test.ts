import request from 'supertest';
import appPromise from '../app';

describe('POST /register', () => {
  it('should return 200 OK for valid email and password', async () => {
    const res = await request(await appPromise)
      .post('/register')
      .send({ email: 'example@example.com', password: 'password123S!' });

    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 Bad Request for invalid email or password with errors', async () => {
    const res = await request(await appPromise)
      .post('/register')
      .send({ email: 'example', password: 'password' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
