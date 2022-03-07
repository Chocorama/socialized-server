const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-errors');

const { SECRET_KEY } = require('../config/selector');

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);

        return user;
      } catch (error) {
        throw new AuthenticationError('Geet message: invalid or expired token');
      }
    }

    throw new AuthenticationError('Geet message: No token was found');
  }

  throw new AuthenticationError(
    'Geet message: Authorization header must be provided'
  );
};
