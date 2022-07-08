import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes/index';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app: Express = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

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
app.use(express.static(path.resolve(__dirname, '../../../../client/build')));
app.use(router);

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`API gateway is running at http://localhost:${port}`);
});
