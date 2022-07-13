import { Response, Request, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['api-secret'] === process.env.API_SECRET || process.env.dev) {
    next();
    return;
  }

  res.status(403).end();
};
