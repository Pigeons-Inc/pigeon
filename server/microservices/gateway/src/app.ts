import express, { Express, Request, Response } from 'express';
import path from 'path';
import proxy from 'express-http-proxy';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.dev) {
  if (!process.env.API_SECRET)
    throw new Error('process.env.API_SECRET is not defined');

  if (!process.env.AUTH_SERVICE_URL) {
    throw new Error('process.env.AUTH_SERVICE_URL is not defined');
  }
}

const app: Express = express();
app.disable('x-powered-by');

app.use(express.json());
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
app.use(
  '/api/auth',
  proxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001')
);
app.use('/api/*', async (req, res, next) => {
  try {
    const { data, status } = await axios.get(
      (process.env.AUTH_SERVICE_URL || 'http://localhost:3001') + '/validate',
      {
        headers: {
          authorization: req.headers.authorization || '',
          'api-secret': <string>process.env.API_SECRET,
        },
      }
    );

    if (status !== 200) {
      res.status(status).send(data);
      return;
    }
    next();
  } catch (err) {
    if (err instanceof AxiosError) {
      res.status(err.response?.status || 500).send(err.response?.data);
      return;
    }
    res.status(500).json(err);
  }
});

app.get('/ping', async (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
