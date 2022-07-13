import request from 'supertest';
import db from '../src/repository/sequelize';
import app from '../src/app';
import User from '../src/models/sequelize/User';
import TokenStore from '../src/models/sequelize/TokenStore';

beforeAll(async () => {
  await db.sync({ logging: false });
});

describe('GET /ping', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
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

let token: string;
let refreshToken: string;
describe('POST /login', () => {
  it('should return 200 OK for valid email and password with tokens in body and cookie', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'example@example.com', password: 'password123S!' });
    expect(res.body).toEqual(expect.any(String));
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.statusCode).toEqual(200);
    token = res.body;
    refreshToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
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

describe('DELETE /logout', () => {
  it('should return 200 OK for valid token', async () => {
    const res = await request(app)
      .delete('/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toEqual(200);
    //return to the inital state
    const res2 = await request(app)
      .post('/login')
      .send({ email: 'example@example.com', password: 'password123S!' });
    token = res2.body;
    refreshToken = res2.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('should return 400 Bad request if token is not provided', async () => {
    const res = await request(app).delete('/logout');
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

describe('GET /validate', () => {
  it('should return 401 Unauthorized for inactivated user', async () => {
    const res = await request(app)
      .get('/validate')
      .set('authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 200 OK for activated user', async () => {
    await User.update(
      { isActivated: true },
      { where: { email: 'example@example.com' } }
    );
    const res = await request(app)
      .get('/validate')
      .set('authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should return 401 Unauthorized for invalid token', async () => {
    const res = await request(app)
      .get('/validate')
      .set('authorization', `Bearer ${token}123`);
    expect(res.statusCode).toEqual(401);
  });
});

describe('GET /refresh', () => {
  it('should return 200 OK for valid token with tokens in body and cookie', async () => {
    const res = await request(app)
      .get('/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(String));
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 400 Bad request if token is not provided', async () => {
    const res = await request(app).get('/refresh');
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 401 Unauthorized for invalid token', async () => {
    const res = await request(app)
      .get('/refresh')
      .set('Cookie', `refreshToken=${refreshToken}123`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

let id: string;
describe('PUT /activate', () => {
  it('should return 200 OK for valid id', async () => {
    await User.update(
      { isActivated: false },
      { where: { email: 'example@example.com' } }
    );
    const user = await User.findOne({
      where: { email: 'example@example.com' },
    });
    id = user?.id || '';
    const res = await request(app).put(`/activate?id=${id}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 Bad request if id is not provided', async () => {
    const res = await request(app).put('/activate');
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 400 Bad request if id is not valid', async () => {
    const res = await request(app).put('/activate?id=123');
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 400 Bad request if user is already activated', async () => {
    const res = await request(app).put(`/activate?id=${id}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await TokenStore.destroy({ where: { id } });
  await User.destroy({
    where: { email: 'example@example.com' },
  });
  await db.close();
});
