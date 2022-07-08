import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';

export default async (req: Request, res: Response, next: NextFunction) => {
  const data = await AuthController.sendRequest(req, res, next);
  if (data) {
    res.json(data);
  }
};
