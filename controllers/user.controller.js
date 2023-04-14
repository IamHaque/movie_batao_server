const Logger = require('../middlewares/logger.middleware');

const JwtHandler = require('../handlers/jwt.handler');
const UserService = require('../database/services/user.service');

/**
 * Login | Returns the user object
 *
 * @requires {email} email: user email
 * @requires {providerId} providerId: user provider id
 */
module.exports.login = async (req, res, next) => {
  const { email, providerId } = req.body;
  if (!email) next(new Error('email is required'));
  if (!providerId) next(new Error('providerId is required'));

  const user = await UserService.get({ email });
  if (!user) return next(new Error('error fetching user'));

  if (user?.providerId !== providerId)
    next(new Error('invalid user credentials'));

  const token = JwtHandler.generateToken({ _id: user._id, providerId, email });
  user.token = token;

  let collections = await UserService.getAllCollectionNames(user?._id);
  if (!collections) collections = [];

  delete user.collections;
  delete user.favorites;
  delete user.__v;
  res.send({ ...user, collections });
};

/**
 * Register | Returns the user object
 *
 * @requires {email} email: user email
 * @requires {username} username: username
 * @requires {providerId} providerId: user provider id
 * @optional {provider} provider: user provider
 */
module.exports.register = async (req, res, next) => {
  const { email, username, provider, providerId } = req.body;
  if (!email) next(new Error('email is required'));
  if (!username) next(new Error('username is required'));
  if (!providerId) next(new Error('providerId is required'));

  const user = await UserService.create({
    email,
    username,
    provider,
    providerId,
  });
  if (!user) return next(new Error('error registering user'));

  const token = JwtHandler.generateToken({ _id: user._id, providerId, email });
  user.token = token;

  let collections = await UserService.getAllCollectionNames(user?._id);
  if (!collections) collections = [];

  delete user.collections;
  delete user.favorites;
  delete user.__v;
  res.send({ ...user, collections });
};
