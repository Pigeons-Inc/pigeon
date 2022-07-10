import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import errorMiddleware from './middlewares/errorMiddleware';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(router);
app.use(errorMiddleware);

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}`);
});
