const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');

const { isInMemoryDatabase, pool } = require('./db');
const { env } = require('./env');

const PgStore = connectPgSimple(session);

function createSessionMiddleware() {
  const store =
    env.nodeEnv === 'test' && isInMemoryDatabase
      ? new session.MemoryStore()
      : new PgStore({
          pool,
          tableName: 'user_sessions',
          createTableIfMissing: false,
        });

  return session({
    store,
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

