import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import requireAuth from '@/middlewares/authentication.middleware';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.registerUser),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.loginUser),
      this.login
    );
    this.router.get(`${this.path}`, requireAuth, this.getUser);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;

      const token = await this.UserService.register(
        name,
        email,
        'user',
        password
      );

      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = await this.UserService.login(email, password);

      res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) {
      next(new HttpException(401, 'User not logged in!'));
    }

    res.status(200).json({ user: req.user });
  };
}

export default UserController;
