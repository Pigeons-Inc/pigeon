import ApiError from '../models/exceptions/ApiError';
import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';

export default (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500;
  let errors = [err];
  let message = 'Unexpected error';
  if (err instanceof ApiError) {
    message = err.message;
    statusCode = err.code;
    errors = err.errors;
  }
  if (err instanceof AxiosError) {
    message = err.message;
    statusCode = err.response?.status || 500;
    errors = [err];
  }
  res.status(statusCode).json({ message, errors });
};
