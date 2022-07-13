import { request } from 'express';
import { ValidationError } from 'sequelize';
import errorMiddleware from '../src/middlewares/errorMiddleware';

test('should work as expected for code = 500', () => {
  const err = new Error('asdad');
  const req = request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  errorMiddleware(err, req, res, () => {
    throw new Error();
  });
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Unexpected error',
    errors: [err],
  });
});

test('should work as expected for ValidationError', () => {
  const err = new ValidationError('Validation error', []);
  const req = request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  errorMiddleware(err, req, res, () => {
    throw new Error();
  });
  expect(res.status).toHaveBeenCalledWith(400);
});
