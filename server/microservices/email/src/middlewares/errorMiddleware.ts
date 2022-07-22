import ApiError from '../errors/ApiError';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../interfaces/ErrorResponse';
import { ValidateError } from 'tsoa';

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

  if (err instanceof ValidateError) {
    errorResponse.message = 'Validation error';
    errorResponse.errors = Array.from(Object.entries(err.fields)).map(
      ([field, error]) => ({
        name: `Validation error for field ${field.split('.').at(-1)}`,
        message: error.message,
      })
    );
    status = err.status;
  }

  return res.status(status).json(errorResponse);
};
