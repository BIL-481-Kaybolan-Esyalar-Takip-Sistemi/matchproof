const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');

const { pool } = require('./db');
const { env } = require('./env');

const PgStore = connectPgSimple(session);

function createSessionMiddleware() {
  return session({
    store: new PgStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: false,
    }),
    name: 'matchproof.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  });
}

module.exports = { createSessionMiddleware };

