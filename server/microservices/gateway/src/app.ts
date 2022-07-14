/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import express, { Express, Request, Response } from 'express';
import path from 'path';
import proxy from 'express-http-proxy';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { request } from 'undici';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authServiceURL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

if (!process.env.dev) {
  if (!process.env.API_SECRET)
    throw new Error('process.env.API_SECRET is not defined');

  if (!process.env.AUTH_SERVICE_URL) {
    throw new Error('process.env.AUTH_SERVICE_URL is not defined');
  }
}

const app: Express = express();
app.disable('x-powered-by');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../../../../client/build')));
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);
app.use('/api', (req, _res, next) => {
  req.headers['api-secret'] = process.env.API_SECRET;
  next();
});
app.use('/api/auth', proxy(authServiceURL));
app.use('/api/*', async (req, res, next) => {
  try {
    const { statusCode, body } = await request(authServiceURL + '/validate', {
      headers: {
        authorization: req.headers.authorization || '',
        'api-secret': req.headers['api-secret'],
      },
      method: 'GET',
    });

    if (statusCode === 200) {
      next();
      return;
    }
    res.status(statusCode).json(await body.json());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Unexpected error', errors: [e] });
  }
});

app.get('/ping', async (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
