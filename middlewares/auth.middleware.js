const JwtHandler = require('../handlers/jwt.handler');

const auth = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) throw new Error('authentication token is required');

    const decoded = JwtHandler.verifyToken(token);
    if (!decoded) throw new Error('token expired');

    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: 'authentication token is invalid or missing',
      status: 500,
    });
  }
};

module.exports = { auth };
