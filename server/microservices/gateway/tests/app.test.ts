import app from '../src/app';
import request from 'supertest';
import AuthService from '../../auth/src/services/AuthService';
import sequelize from '../../auth/src/repository/sequelize';
import User from '../../auth/src/models/sequelize/User';
import { ChildProcess, fork } from 'child_process';
import path from 'path';
import TokenStore from '../../auth/src/models/sequelize/TokenStore';

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

let child: ChildProcess;
describe('GET /api/*', () => {
  it('should return 500 Internal Server Error if there is no connection to auth service', async () => {
    const res = await request(app).get('/api/asdadads');
    expect(res.status).toBe(500);
  });
  it('should return 401', async () => {
    child = fork(path.resolve(__dirname + '../../../auth/build/index.js'));
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await sequelize.sync();
        request(app)
          .get('/api/asdadads')
          .then((res) => {
            expect(res.status).toBe(401);
            resolve();
          });
      }, 5000);
    });
  }, 10000);

  it('should be OK with /api/auth', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.status).toBe(404);
  });

  it('should return 404 Not Found for /api/asdadads if user is authenticated', async () => {
    const authService = new AuthService();
    const { accessToken } = await authService.register(
      'example@example.com',
      '12345678pS!'
    );
    const user = await User.findOne({
      where: { email: 'example@example.com' },
    });
    await authService.activate(user?.id || '');
    const res = await request(app)
      .get('/api/asdadads')
      .set('authorization', `Bearer ${accessToken}`);

    TokenStore.destroy({ where: { id: user?.id } });
    user?.destroy();
    await new Promise<void>((resolve) => {
      child.kill('SIGTERM');
      const interval = setInterval(() => {
        if (child.killed) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
    await sequelize.close();
    expect(res.status).toBe(404);
  });
});
