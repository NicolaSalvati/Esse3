const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Middleware per proteggere le rotte
exports.protect = async (req, res, next) => {
  let token;

  // Verifica se il token è presente nell'header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Estrai il token dall'header
    token = req.headers.authorization.split(' ')[1];
  }

  // Verifica se il token esiste
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accesso non autorizzato. Effettua il login per accedere a questa risorsa.'
    });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Trova l'utente associato al token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non trovato. Token non valido.'
      });
    }

    // Aggiungi l'utente alla richiesta
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token non valido o scaduto. Effettua nuovamente il login.'
    });
  }
};

// Middleware per verificare i ruoli
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Il ruolo ${req.user.role} non è autorizzato ad accedere a questa risorsa.`
      });
    }
    next();
  };
};
