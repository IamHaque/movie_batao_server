const UserService = require('../database/services/user.service');

module.exports.getUser = async (req, res, next) => {
  const email = req.body.email;
  if (!email) next(new Error('email is required'));

  const user = await UserService.readByEmail(email);
  if (!user) return next(new Error('error fetching user'));

  res.send(user);
};

module.exports.createUser = async (req, res, next) => {
  const { email, username, provider } = req.body;
  if (!email) next(new Error('email is required'));
  if (!username) next(new Error('username is required'));

  const user = await UserService.create({ email, username, provider });
  if (!user) return next(new Error('error registering user'));

  res.send(user);
};
