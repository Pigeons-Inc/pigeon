import express, { Express, Request, Response } from 'express';
import path from 'path';
import proxy from 'express-http-proxy';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../../../../client/build')));
app.use(
  '/api/auth',
  proxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001')
);
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

app.get('/ping', async (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
