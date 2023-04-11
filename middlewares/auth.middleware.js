const Logger = require('./logger.middleware');
const JwtHandler = require('../handlers/jwt.handler');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('token is required');

    const [prefix, token] = authHeader.split(' ');
    if (prefix !== 'Bearer' || !token) throw new Error('invalid token');

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
