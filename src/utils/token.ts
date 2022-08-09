import jwt from 'jsonwebtoken';
import User from '@/resources/user/user.interface';
import Token from '@/utils/interfaces/token.interface';

export const createToken = (user: User): string => {
  const { JWT_SECRET } = process.env;
  return jwt.sign({ id: user._id }, JWT_SECRET as jwt.Secret, {
    expiresIn: '1d',
  });
};

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | Token> => {
  const { JWT_SECRET } = process.env;
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET as jwt.Secret, (err, decoded) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(decoded as Token);
      }
    });
  });
};

export default { createToken, verifyToken };
