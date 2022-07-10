import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import ApiError from '../models/exceptions/ApiError';

const controller = new AuthController();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) throw ApiError.unauthorized('No token provided');
    await controller.validate(token);
    res.end();
  } catch (e) {
    next(e);
  }
};
