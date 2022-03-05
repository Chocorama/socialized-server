const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
};

module.exports = {
  Mutation: {
    login: async (parent, { username, password }, context, info) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.wrongPassword = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user.toJSON(),
        id: user._id,
        token,
      };
    },
    register: async (
      _,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) => {
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );

      if (!valid) throw new UserInputError('Errors', { errors });
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      const hashed = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashed,
        username,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res.toJSON(),
        id: res._id,
        token,
      };
    },
  },
};
