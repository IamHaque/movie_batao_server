const UserService = require('../database/services/user.service');
const JwtHandler = require('../handlers/jwt.handler');

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

  const user = await UserService.readByEmail(email);
  if (!user) return next(new Error('error fetching user'));

  if (user?.providerId !== providerId)
    next(new Error('invalid user credentials'));

  const token = JwtHandler.generateToken({ providerId, email });
  user.token = token;

  res.send(user);
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

  const token = JwtHandler.generateToken({ providerId, email });
  user.token = token;

  res.send(user);
};
