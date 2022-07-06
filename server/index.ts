import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app: Express = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.get('*', (_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
