import Joi from 'joi';

const registerUser = Joi.object({
  name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default { registerUser, loginUser };
