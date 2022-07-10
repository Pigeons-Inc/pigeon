import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';

const controller = new AuthController();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller.logout(req.headers.cookie);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
    });
    res.end();
  } catch (e) {
    next(e);
  }
};
