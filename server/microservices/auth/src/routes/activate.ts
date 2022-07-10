import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';

const controller = new AuthController();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    await controller.activate(<string>id);
    res.end();
  } catch (e) {
    next(e);
  }
};
