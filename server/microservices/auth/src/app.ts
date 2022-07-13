import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/errorMiddleware';
import { RegisterRoutes as registerRoutes } from './routes/routes';
import checkAPISecretMiddleware from './middlewares/checkAPISecretMiddleware';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.dev) {
  if (!process.env.PASSWORD_SALT)
    throw new Error('PASSWORD_SALT is not defined');
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  if (!process.env.API_SECRET)
    throw new Error('process.env.API_SECRET is not defined');
}

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

app.get('*', async (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
