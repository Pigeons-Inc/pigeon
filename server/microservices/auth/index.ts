import express, { Express, Request, Response } from 'express';
import findConfig from 'find-config';
import * as dotenv from 'dotenv';
dotenv.config({ path: findConfig('.env') ?? undefined });

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
