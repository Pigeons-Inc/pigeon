import express, { Express, Request, Response } from 'express';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import router from './routes/index';
import errorMiddleware from './middlewares/errorMiddleware';

const app: Express = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../../../../client/build')));
app.use('/api', router);
app.use(errorMiddleware);

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`API gateway is running at http://localhost:${port}`);
});
