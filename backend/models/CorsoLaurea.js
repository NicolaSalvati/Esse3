const mongoose = require('mongoose');

const CorsoLaureaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del corso di laurea è obbligatorio'],
    trim: true,
    unique: true
  },
  codice: {
    type: String,
    required: [true, 'Il codice del corso di laurea è obbligatorio'],
    trim: true,
    unique: true
  },
  durata: {
    type: Number,
    required: [true, 'La durata del corso di laurea è obbligatoria'],
    min: 1,
    max: 6
  },
  dipartimento: {
    type: String,
    required: [true, 'Il dipartimento è obbligatorio'],
    trim: true
  },
  descrizione: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CorsoLaurea', CorsoLaureaSchema);
