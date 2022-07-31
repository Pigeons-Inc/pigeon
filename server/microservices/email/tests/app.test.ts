import request from 'supertest';
import app from '../src/app';
import nodemailer from 'nodemailer';

beforeAll(async () => {
  process.env.API_SECRET = 'test-secret';
  const testAccount = await nodemailer.createTestAccount();

  process.env.SMTP_USER = testAccount.user;
  process.env.SMTP_PASSWORD = testAccount.pass;
  process.env.SMTP_HOST = testAccount.smtp.host;
  process.env.SMTP_PORT = String(testAccount.smtp.port);
  process.env.SMTP_SECURE = String(testAccount.smtp.secure);

  jest.setTimeout(15000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

describe('General tests', () => {
  it('forbids access without an api-secret header', () => {
    return request(app).get('/').expect(403);
  });
  it('should return swagger docs', () => {
    return request(app)
      .get('/docs')
      .set('api-secret', 'test-secret')
      .expect('Content-Type', /html/)
      .expect(301);
  });
});

describe('POST /activation', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .post('/activation')
      .send({
        link: 'http://localhost:3000/api/auth/activate?id=1b976499-b645-4517-9930-33df8e94e4cc',
        sendTo: 'master.deliberator@gmail.com',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(200);
    expect(res.body.accepted).toEqual(['master.deliberator@gmail.com']);
  });

  it('should return 400 when passed invalid input data', async () => {
    const res = await request(app)
      .post('/reset')
      .send({
        link: 56456346,
        sendTo: 'example@example.com',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(400);
  });

  it('should return many errors when passed multiple invalid fields', async () => {
    const res = await request(app)
      .post('/reset')
      .send({
        link: 6786578,
        sendTo: 12341234,
        dfdf: 'dsfasdfas',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBe(3);
  });
});

describe('POST /reset', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .post('/reset')
      .send({
        link: 'http://localhost:3000/api/auth/activate?id=1b976499-b645-4517-9930-33df8e94e4cc',
        sendTo: 'master.deliberator@gmail.com',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(200);
    expect(res.body.accepted).toEqual(['master.deliberator@gmail.com']);
  });

  it('should return 400 when passed invalid input data', async () => {
    const res = await request(app)
      .post('/reset')
      .send({
        link: 12345,
        sendTo: 'master.deliberator@gmail.com',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(400);
  });

  it('should return many errors when passed multiple invalid fields', async () => {
    const res = await request(app)
      .post('/reset')
      .send({
        link: 12345,
        sendTo: 123,
        dfdf: 'dfdf',
      })
      .set('api-secret', 'test-secret');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBe(3);
  });
});
