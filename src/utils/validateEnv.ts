import { cleanEnv, str, port } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    PORT: port({
      default: 3000,
    }),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
