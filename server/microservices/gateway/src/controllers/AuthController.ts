import { Request, Response, NextFunction } from 'express';
import { Route } from 'tsoa';
import ApiError from '../models/exceptions/ApiError';
import getRequestMethod from '../utils/getRequestMethod';

@Route('/api/auth')
export default class AuthController {
  public static async sendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const axiosMethod = getRequestMethod(req);
      const url =
        (process.env.AUTH_SERVICE_URL || 'http://localhost:3001') +
        req.url.replace('/auth', '');
      const { data, status } = await axiosMethod(url, {
        data: req.body,
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
      });
      if (!data || status < 200 || status >= 300)
        throw new ApiError('Auth error', status, [data]);
      res.status(status);
      return data;
    } catch (e) {
      next(e);
    }
  }
}
