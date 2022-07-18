import ApiError from '../errors/ApiError';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../interfaces/ErrorResponse';

export default (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const errorResponse: ErrorResponse = {
    message: 'An unknown error occurred',
    errors: [],
  };
  let status = 500;

  if (err instanceof ApiError) {
    errorResponse.message = err.message;
    errorResponse.errors = err.errors;
    status = err.status;
  }
  return res.status(status).json(errorResponse);
};
