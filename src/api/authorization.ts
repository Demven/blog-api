import jwtAuth from 'express-jwt';
import { Request, Response } from 'express';

const { JWT_SECRET } = process.env;

export const authorization = jwtAuth({
  secret: <string>JWT_SECRET,
  algorithms: ['HS256'],
});

export const processAuthError = (error:Error, req:Request, res:Response, next:Function) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized access');
  } else {
    next();
  }
};
