import HttpException from '@/utils/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import jwt from 'jsonwebtoken';

async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const headerToken = req.headers.authorization;

  if (!headerToken || !headerToken.startsWith('Bearer ')) {
    return next(new HttpException(401, 'Unauthorised'));
  }

  const accessToken = headerToken.split('Bearer ')[1].trim();

  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    const user = await UserModel.findById(payload.id)
      .select('-password')
      .exec();

    if (!user) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised'));
  }
}

export default requireAuth;
