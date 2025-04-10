const dotenv = require('dotenv');
const path = require('path');

// Carica il file .env appropriato in base all'ambiente
const environment = process.env.NODE_ENV || 'development';
dotenv.config();

// Configurazione di base
const config = {
  // Informazioni sull'applicazione
  app: {
    name: process.env.APP_NAME || 'ESSE3 Portal',
    description: process.env.APP_DESCRIPTION || 'Sistema di Segreteria Studenti',
    version: process.env.APP_VERSION || '1.0.0',
    environment,
    baseUrl: process.env.BASE_URL || 'http://localhost:3010',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT, 10) || 3010,
    apiPrefix: process.env.API_PREFIX || '/api/v1',
  },

  // Configurazione del database
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/esse3-portal',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Aumentato per evitare timeout
      autoIndex: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      family: 4
    }
  },

  // Configurazione JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'esse3-secure-jwt-secret-key-2025',
    expire: process.env.JWT_EXPIRE || '30d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'esse3-secure-refresh-token-key-2025',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  },

  // Configurazione di sicurezza
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 6,
      requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
      requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
      requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
    },
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutTime: parseInt(process.env.LOCKOUT_TIME, 10) || 15 * 60 * 1000, // 15 minuti
  }
};

module.exports = config;
