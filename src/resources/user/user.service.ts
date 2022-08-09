import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
  /**
   * Create / Register a new user
   */

  public async register(
    name: string,
    email: string,
    role: string,
    password: string
  ): Promise<string | Error> {
    try {
      const userIsExists = await UserModel.findOne({ email });

      if (userIsExists) {
        throw new Error('Email already in use!');
      }

      const user = await UserModel.create({
        name,
        email,
        role,
        password,
      });

      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * LOGIN A USER
   *
   */

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error('User to find user with this email address');
      }

      const isValidPassword = await user.isValidPassword(password);

      if (!isValidPassword) {
        throw new Error('Invalid Credentials');
      }

      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error) {
      throw new Error('Unable to login user');
    }
  }
}

export default UserService;
