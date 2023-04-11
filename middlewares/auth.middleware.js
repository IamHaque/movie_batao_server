const Logger = require('./logger.middleware');
const JwtHandler = require('../handlers/jwt.handler');

const auth = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) throw new Error('authentication token is required');

    const decoded = JwtHandler.verifyToken(token);
    if (!decoded) throw new Error('token expired');

    const { _id, email, providerId } = decoded;
    if (!_id || !email || !providerId) throw new Error('invalid token data');

    req.user = { _id, email, providerId };
    return next();
  } catch (err) {
    Logger.logError(`Auth | ${err.message}`);

    return res.status(500).json({
      message: 'authentication token is invalid or missing',
      status: 500,
    });
  }
};

module.exports = { auth };
