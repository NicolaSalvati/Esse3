const mongoose = require('mongoose');

const FacoltaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome della facoltà è obbligatorio'],
    trim: true,
    unique: true
  },
  descrizione: {
    type: String,
    trim: true
  },
  corsi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CorsoLaurea'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Facolta', FacoltaSchema);
