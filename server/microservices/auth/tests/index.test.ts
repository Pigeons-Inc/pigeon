import request from 'supertest';
import db from '../src/repository/sequelize';
import app from '../src/app';
import User from '../src/models/sequelize/User';

beforeAll(async () => {
  await db.sync({ logging: false });
});

describe('GET /ping', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /register', () => {
  it('should return 200 OK for valid email and password with tokens in body and cookie', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'example@example.com', password: 'password123S!' });
    expect(res.body).toEqual(expect.any(String));
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 Bad Request for invalid email or password with errors', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'example', password: 'password' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

describe('POST /login', () => {
  it('should return 200 OK for valid email and password with tokens in body and cookie', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'example@example.com', password: 'password123S!' });
    expect(res.body).toEqual(expect.any(String));
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 Bad request for invalid email and/or password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'example', password: 'password' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 401 Unauthorized if there is no such user in db', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'adada@gmail.com', password: 'password123S!' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

describe('POST /validateCredentials', () => {
  it('should return 200 OK for valid email and password', async () => {
    const res = await request(app)
      .post('/validateCredentials')
      .send({ email: 'example@example.com', password: 'password123S!' });
    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 Bad request for invalid email and/or password', async () => {
    const res = await request(app)
      .post('/validateCredentials')
      .send({ email: 'example', password: 'password' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await User.destroy({
    where: { email: 'example@example.com' },
  });
  await db.close();
});
