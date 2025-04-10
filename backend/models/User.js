const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  matricola: {
    type: String,
    required: [true, 'La matricola è obbligatoria'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Inserisci un indirizzo email valido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'superadmin'],
    default: 'student'
  },
  corso: {
      type: String,
  },
  anno: {
    type: Number,
    min: 1,
    max: 6,
    default: 1
  },
  telefono: {
    type: String,
    trim: true
  },
  indirizzo: {
    type: String,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role !== 'student';
    }
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Crittografa la password prima del salvataggio
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metodo per verificare la password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Metodo per generare il token JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

// Metodo per generare il token di refresh
UserSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

// Metodo per verificare se l'account è bloccato
UserSchema.methods.isLocked = function() {
  // Controlla se il tempo di blocco è passato
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Metodo per incrementare i tentativi di login falliti
UserSchema.methods.incrementLoginAttempts = async function() {
  // Se esiste un blocco ma è scaduto
  if (this.lockUntil && this.lockUntil < Date.now()) {
    // Resetta i tentativi di login e rimuovi il blocco
    this.loginAttempts = 1;
    this.lockUntil = undefined;
    return await this.save();
  }
  
  // Incrementa i tentativi di login
  this.loginAttempts += 1;
  
  // Blocca l'account se ha raggiunto il numero massimo di tentativi
  if (this.loginAttempts >= config.security.maxLoginAttempts && !this.isLocked()) {
    this.lockUntil = Date.now() + config.security.lockoutTime;
  }
  
  return await this.save();
};

// Metodo per resettare i tentativi di login dopo un login riuscito
UserSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return await this.save();
};

module.exports = mongoose.model('User', UserSchema);
