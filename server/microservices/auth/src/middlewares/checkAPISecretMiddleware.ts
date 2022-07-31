/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import { Response, Request, NextFunction } from 'express';
import ErrorResponse from '../models/interfaces/ErrorResponse';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['api-secret'] === process.env.API_SECRET || process.env.dev) {
    next();
    return;
  }
  const errorResponse: ErrorResponse = {
    message: 'Forbidden',
    errors: [{ name: 'API key Error', message: 'API key is invalid' }],
  };
  res.status(403).json(errorResponse);
};
