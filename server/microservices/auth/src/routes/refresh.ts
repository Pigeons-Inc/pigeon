import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';

const controller = new AuthController();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = await controller.refresh(req.cookies);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json(accessToken);
  } catch (e) {
    next(e);
  }
};
