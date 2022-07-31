import express, { Express, Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import errorMiddleware from './middlewares/errorMiddleware';
import { RegisterRoutes as registerRoutes } from './routes/routes';
import checkAPISecretMiddleware from './middlewares/checkAPISecretMiddleware';

if (!process.env.dev && !process.env.API_SECRET)
  throw new Error('process.env.API_SECRET is not defined');

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

app.use(checkAPISecretMiddleware);
registerRoutes(app);
app.use(errorMiddleware);

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
