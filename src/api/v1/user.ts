import { Router as expressRouter, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../dal/models/user';

const { JWT_SECRET } = process.env;

const router = expressRouter();

const ONE_DAY = 60 * 60 * 24;

function getToken(user:any):string {
  return jwt.sign({ id: user._id, name: user.name }, <string>JWT_SECRET, { expiresIn: ONE_DAY });
}

function decodeToken(token:string) {
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, <string>JWT_SECRET);
  } catch (error) {
    decodedPayload = null;
  }

  return decodedPayload;
}

router.post('/login', (req:Request, res:Response, next) => {
  const name = req.body.name;
  const password = req.body.password;

  if (!name) {
    return res.status(400).send('Enter your name!');
  } else if (!password) {
    return res.status(400).send('Enter your password!');
  }

  return User.findOne({ name, password })
    .then((userFromDb:any) => {
      if (userFromDb && userFromDb.name === name) {
        res.json({ token: getToken(userFromDb) });
      } else {
        return res.status(400).send('Wrong name or password!');
      }
    })
    .catch(error => next(error));
});

router.post('/validate', (req:Request, res:Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send('You must provide a JWT token');
  }

  const tokenPayload:any = decodeToken(token);
  if (tokenPayload) {
    return res.json({ success: 'true', payload: tokenPayload });
  } else {
    return res.status(400).send('Invalid token');
  }
});

export default router;
