const mongoose = require('mongoose');

const ImmatricolazioneRequestSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  cognome: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Inserisci un indirizzo email valido'
    ]
  },
  codiceFiscale: {
    type: String,
    required: [true, 'Il codice fiscale è obbligatorio'],
    trim: true,
    uppercase: true,
    length: 16
  },
  dataNascita: {
    type: Date,
    required: [true, 'La data di nascita è obbligatoria']
  },
  luogoNascita: {
    type: String,
    required: [true, 'Il luogo di nascita è obbligatorio'],
    trim: true
  },
  indirizzo: {
    type: String,
    required: [true, 'L\'indirizzo è obbligatorio'],
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'Il numero di telefono è obbligatorio'],
    trim: true
  },
  tipoImmatricolazione: {
    type: String,
    required: [true, 'Il tipo di immatricolazione è obbligatorio'],
    enum: ['Immatricolazione standard', 'Abbreviazione Carriera'],
    default: 'Immatricolazione standard'
  },
  tipoCorso: {
    type: String,
    required: [true, 'Il tipo di corso è obbligatorio'],
    enum: ['triennale', 'magistrale', 'magistrale a ciclo unico'],
  },
  corsoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CorsoLaurea',
    required: [true, 'Il corso di laurea è obbligatorio']
  },
  diplomaScuola: {
    type: String,
    required: [true, 'Il diploma di scuola superiore è obbligatorio'],
    trim: true
  },
  votoScuola: {
    type: Number,
    required: [true, 'Il voto di diploma è obbligatorio'],
    min: 60,
    max: 100
  },
  // Solo per Abbreviazione Carriera
  universitaPrecedente: {
    type: String,
    trim: true
  },
  corsoPrecedente: {
    type: String,
    trim: true
  },
  esamiSostenuti: [{
    nome: String,
    voto: Number,
    cfu: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  matricola: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ImmatricolazioneRequest', ImmatricolazioneRequestSchema);
