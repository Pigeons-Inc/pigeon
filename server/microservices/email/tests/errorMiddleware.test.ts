import { jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import errorMiddleware from '../src/middlewares/errorMiddleware';

describe('errorMiddleware', () => {
  let mockRequest: Partial<Request>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse),
    };
  });

  test('unknown error', async () => {
    const expectedResponse = {
      message: 'An unknown error occurred',
      errors: [],
    };
    errorMiddleware(
      new Error('random error'),
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  test('validate error', async () => {
    const expectedResponse = {
      message: 'Validation error',
      errors: [
        { name: 'Validation error for field link', message: 'incorrect link' },
      ],
    };
    const validateError = new ValidateError(
      { 'dto.link': { message: 'incorrect link', value: 123 } },
      'Validate error'
    );
    errorMiddleware(
      validateError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});
