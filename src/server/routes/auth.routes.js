const express = require('express');

const {
  getCurrentUser,
  loginUser,
  registerUser,
  toPublicUser,
} = require('../services/auth.service');
const { requireAuth } = require('../services/require-auth');

const router = express.Router();

function persistAuthenticatedSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      resolve();
    });
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    await persistAuthenticatedSession(req, user);

    res.status(201).json({
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    await persistAuthenticatedSession(req, user);

    res.status(200).json({
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  if (!req.session) {
    res.clearCookie('matchproof.sid');
    res.status(204).send();
    return;
  }

  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie('matchproof.sid');
    res.status(204).send();
  });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.session.userId);

    res.status(200).json({
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
