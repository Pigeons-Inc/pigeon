import { Response, Request, NextFunction } from 'express';
import ApiError from '../errors/ApiError';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['api-secret'] === process.env.API_SECRET || process.env.dev) {
    next();
    return;
  }

  throw ApiError.forbidden();
};
