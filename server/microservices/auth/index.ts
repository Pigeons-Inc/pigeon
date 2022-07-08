import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3001;

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to auth service!' });
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`Auth service is running at https://localhost:${port}`);
});
