const ImmatricolazioneRequest = require('../models/ImmatricolazioneRequest');
const User = require('../models/User');
const CorsoLaurea = require('../models/CorsoLaurea');
const Facolta = require('../models/Facolta');
const { validationResult } = require('express-validator');

// @desc    Crea una nuova richiesta di immatricolazione
// @route   POST /api/v1/immatricolazione
// @access  Public
exports.createImmatricolazioneRequest = async (req, res) => {
  try {
    // Validazione input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Crea la richiesta di immatricolazione
    const immatricolazioneRequest = await ImmatricolazioneRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: immatricolazioneRequest,
      message: 'Richiesta di immatricolazione inviata con successo. Attendi l\'approvazione dell\'amministratore.'
    });
  } catch (error) {
    console.error('Errore durante la creazione della richiesta di immatricolazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la creazione della richiesta di immatricolazione. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni tutte le richieste di immatricolazione
// @route   GET /api/v1/immatricolazione
// @access  Private/Admin
exports.getImmatricolazioneRequests = async (req, res) => {
  try {
    // Filtra per stato se specificato
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const immatricolazioneRequests = await ImmatricolazioneRequest.find(filter)
      .populate('corsoId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: immatricolazioneRequests.length,
      data: immatricolazioneRequests
    });
  } catch (error) {
    console.error('Errore durante il recupero delle richieste di immatricolazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle richieste di immatricolazione. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni una singola richiesta di immatricolazione
// @route   GET /api/v1/immatricolazione/:id
// @access  Private/Admin
exports.getImmatricolazioneRequest = async (req, res) => {
  try {
    const immatricolazioneRequest = await ImmatricolazioneRequest.findById(req.params.id)
      .populate('corsoId');
    
    if (!immatricolazioneRequest) {
      return res.status(404).json({
        success: false,
        message: 'Richiesta di immatricolazione non trovata'
      });
    }
    
    res.status(200).json({
      success: true,
      data: immatricolazioneRequest
    });
  } catch (error) {
    console.error('Errore durante il recupero della richiesta di immatricolazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero della richiesta di immatricolazione. Riprova più tardi.'
    });
  }
};

// @desc    Approva una richiesta di immatricolazione
// @route   PUT /api/v1/immatricolazione/:id/approve
// @access  Private/Admin
exports.approveImmatricolazioneRequest = async (req, res) => {
  try {
    const { matricola } = req.body;
    
    // Verifica input
    if (!matricola) {
      return res.status(400).json({
        success: false,
        message: 'La matricola è obbligatoria'
      });
    }
    
    // Verifica il formato della matricola
    if (!matricola.startsWith('012400') || matricola.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'La matricola deve iniziare con 012400 e avere 10 caratteri'
      });
    }
    
    // Verifica se la matricola è già assegnata
    const existingUser = await User.findOne({ matricola });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Questa matricola è già assegnata a un altro studente'
      });
    }
    
    // Trova la richiesta di immatricolazione
    const immatricolazioneRequest = await ImmatricolazioneRequest.findById(req.params.id);
    
    if (!immatricolazioneRequest) {
      return res.status(404).json({
        success: false,
        message: 'Richiesta di immatricolazione non trovata'
      });
    }
    
    // Crea un nuovo utente
    const user = await User.create({
      name: `${immatricolazioneRequest.nome} ${immatricolazioneRequest.cognome}`,
      email: immatricolazioneRequest.email,
      password: Math.random().toString(36).slice(-8), // Password temporanea casuale
      matricola,
      role: 'student',
      corso: immatricolazioneRequest.corsoId,
      telefono: immatricolazioneRequest.telefono,
      indirizzo: immatricolazioneRequest.indirizzo,
      isApproved: true
    });
    
    // Aggiorna la richiesta di immatricolazione
    immatricolazioneRequest.status = 'approved';
    immatricolazioneRequest.matricola = matricola;
    immatricolazioneRequest.userId = user._id;
    await immatricolazioneRequest.save();
    
    res.status(200).json({
      success: true,
      data: immatricolazioneRequest,
      user,
      message: `Richiesta di immatricolazione approvata. Matricola ${matricola} assegnata a ${user.name}`
    });
  } catch (error) {
    console.error('Errore durante l\'approvazione della richiesta di immatricolazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'approvazione della richiesta di immatricolazione. Riprova più tardi.'
    });
  }
};

// @desc    Rifiuta una richiesta di immatricolazione
// @route   PUT /api/v1/immatricolazione/:id/reject
// @access  Private/Admin
exports.rejectImmatricolazioneRequest = async (req, res) => {
  try {
    const { motivo } = req.body;
    
    // Trova la richiesta di immatricolazione
    const immatricolazioneRequest = await ImmatricolazioneRequest.findById(req.params.id);
    
    if (!immatricolazioneRequest) {
      return res.status(404).json({
        success: false,
        message: 'Richiesta di immatricolazione non trovata'
      });
    }
    
    // Aggiorna la richiesta di immatricolazione
    immatricolazioneRequest.status = 'rejected';
    immatricolazioneRequest.motivoRifiuto = motivo || 'Nessun motivo specificato';
    await immatricolazioneRequest.save();
    
    res.status(200).json({
      success: true,
      data: immatricolazioneRequest,
      message: 'Richiesta di immatricolazione rifiutata'
    });
  } catch (error) {
    console.error('Errore durante il rifiuto della richiesta di immatricolazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il rifiuto della richiesta di immatricolazione. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni tutti i corsi di laurea per facoltà
// @route   GET /api/v1/immatricolazione/corsi
// @access  Public
exports.getCorsiByFacolta = async (req, res) => {
  try {
    const facolta = await Facolta.find().populate('corsi');
    
    res.status(200).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante il recupero dei corsi di laurea:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei corsi di laurea. Riprova più tardi.'
    });
  }
};
