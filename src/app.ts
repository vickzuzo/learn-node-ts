import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import helmet from 'helmet';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initDatabaseConnection();
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  private initMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initDatabaseConnection(): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, NODE_ENV } = process.env;

    const url =
      NODE_ENV === 'production'
        ? `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`
        : 'mongodb://localhost:27017/Blog-Service';

    mongoose.connect(url);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
