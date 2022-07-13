import { Response, Request, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (
    !process.env.dev &&
    req.headers['api-secret'] !== process.env.API_SECRET
  ) {
    res.status(403).end();
    return;
  }
  next();
};
