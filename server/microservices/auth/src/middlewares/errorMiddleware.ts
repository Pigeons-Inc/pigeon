import ApiError from '../models/exceptions/ApiError';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../models/interfaces/ErrorResponse';
import { ValidateError } from 'tsoa';
import { ValidationError } from 'sequelize';

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

  if (err instanceof ValidationError) {
    message = err.message;
    statusCode = 400;
    errors = err.errors.map((error) => ({
      name: 'Validation error: ' + error.path || '',
      message: error.message,
    }));
  }

  if (err instanceof ValidateError) {
    message = "Something's wrong with your request";
    statusCode = 400;
    errors = [
      { name: 'Validation error', message: JSON.stringify(err.fields) },
    ];
  }

  if (statusCode === 500) console.error(err);
  const errorResonse: ErrorResponse = { message, errors };
  res.status(statusCode).json(errorResonse);
};
