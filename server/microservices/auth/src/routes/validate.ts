import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';

const controller = new AuthController();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller.validate(req.headers.authorization);
    res.end();
  } catch (e) {
    next(e);
  }
};
