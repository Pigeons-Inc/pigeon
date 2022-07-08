import { Request, Response } from 'express';
import PingController from '../controllers/PingController';

export default async (_req: Request, res: Response) => {
  res.json(await PingController.getMessage());
};
