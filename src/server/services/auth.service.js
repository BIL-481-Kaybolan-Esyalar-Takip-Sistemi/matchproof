const bcrypt = require('bcryptjs');

const {
  createUser,
  findUserByEmail,
  findUserById,
} = require('../models/user.model');
const { AppError } = require('./app-error');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SALT_ROUNDS = 10;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateRegistrationInput(payload) {
  const name = String(payload.name || '').trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!name) {
    throw new AppError('Name is required.', {
      statusCode: 400,
      code: 'INVALID_NAME',
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError('A valid email is required.', {
      statusCode: 400,
      code: 'INVALID_EMAIL',
    });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`, {
      statusCode: 400,
      code: 'INVALID_PASSWORD',
    });
  }

  return { name, email, password };
}

function validateLoginInput(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError('A valid email is required.', {
      statusCode: 400,
      code: 'INVALID_EMAIL',
    });
  }

  if (!password) {
    throw new AppError('Password is required.', {
      statusCode: 400,
      code: 'INVALID_PASSWORD',
    });
  }

  return { email, password };
}

async function registerUser(payload) {
  const { name, email, password } = validateRegistrationInput(payload);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError('A user with this email already exists.', {
      statusCode: 409,
      code: 'EMAIL_ALREADY_IN_USE',
    });
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  return createUser({
    name,
    email,
    passwordHash,
  });
}

async function loginUser(payload) {
  const { email, password } = validateLoginInput(payload);

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password.', {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  }

  return user;
}

async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError('Authenticated user could not be found.', {
      statusCode: 401,
      code: 'AUTH_USER_NOT_FOUND',
    });
  }

  return user;
}

module.exports = {
  getCurrentUser,
  loginUser,
  registerUser,
  toPublicUser,
};

