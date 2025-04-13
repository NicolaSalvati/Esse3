const Facolta = require('../models/Facolta');
const CorsoLaurea = require('../models/CorsoLaurea');
const { validationResult } = require('express-validator');

// @desc    Crea una nuova facoltà
// @route   POST /api/v1/facolta
// @access  Private/Admin
exports.createFacolta = async (req, res) => {
  try {
    // Validazione input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { nome, descrizione } = req.body;

    // Verifica se la facoltà esiste già
    const facoltaExists = await Facolta.findOne({ nome });
    if (facoltaExists) {
      return res.status(400).json({
        success: false,
        message: 'Facoltà già esistente'
      });
    }

    // Crea la facoltà
    const facolta = await Facolta.create({
      nome,
      descrizione,
      corsi: []
    });

    res.status(201).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante la creazione della facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la creazione della facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni tutte le facoltà
// @route   GET /api/v1/facolta
// @access  Public
exports.getFacolta = async (req, res) => {
  try {
    const facolta = await Facolta.find().populate('corsi');
    
    res.status(200).json({
      success: true,
      count: facolta.length,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante il recupero delle facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni una singola facoltà
// @route   GET /api/v1/facolta/:id
// @access  Public
exports.getSingleFacolta = async (req, res) => {
  try {
    const facolta = await Facolta.findById(req.params.id).populate('corsi');
    
    if (!facolta) {
      return res.status(404).json({
        success: false,
        message: 'Facoltà non trovata'
      });
    }
    
    res.status(200).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante il recupero della facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero della facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Aggiorna una facoltà
// @route   PUT /api/v1/facolta/:id
// @access  Private/Admin
exports.updateFacolta = async (req, res) => {
  try {
    let facolta = await Facolta.findById(req.params.id);
    
    if (!facolta) {
      return res.status(404).json({
        success: false,
        message: 'Facoltà non trovata'
      });
    }
    
    facolta = await Facolta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento della facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Elimina una facoltà
// @route   DELETE /api/v1/facolta/:id
// @access  Private/Admin
exports.deleteFacolta = async (req, res) => {
  try {
    const facolta = await Facolta.findById(req.params.id);
    
    if (!facolta) {
      return res.status(404).json({
        success: false,
        message: 'Facoltà non trovata'
      });
    }
    
    // Verifica se ci sono corsi associati
    if (facolta.corsi && facolta.corsi.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossibile eliminare la facoltà perché ci sono corsi associati'
      });
    }
    
    await facolta.remove();
    
    res.status(200).json({
      success: true,
      message: 'Facoltà eliminata con successo'
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione della facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Aggiungi un corso a una facoltà
// @route   PUT /api/v1/facolta/:id/addcorso
// @access  Private/Admin
exports.addCorsoToFacolta = async (req, res) => {
  try {
    const { corsoId } = req.body;
    
    if (!corsoId) {
      return res.status(400).json({
        success: false,
        message: 'ID del corso obbligatorio'
      });
    }
    
    const facolta = await Facolta.findById(req.params.id);
    
    if (!facolta) {
      return res.status(404).json({
        success: false,
        message: 'Facoltà non trovata'
      });
    }
    
    const corso = await CorsoLaurea.findById(corsoId);
    
    if (!corso) {
      return res.status(404).json({
        success: false,
        message: 'Corso non trovato'
      });
    }
    
    // Verifica se il corso è già associato alla facoltà
    if (facolta.corsi.includes(corsoId)) {
      return res.status(400).json({
        success: false,
        message: 'Corso già associato a questa facoltà'
      });
    }
    
    facolta.corsi.push(corsoId);
    await facolta.save();
    
    res.status(200).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del corso alla facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiunta del corso alla facoltà. Riprova più tardi.'
    });
  }
};

// @desc    Rimuovi un corso da una facoltà
// @route   PUT /api/v1/facolta/:id/removecorso
// @access  Private/Admin
exports.removeCorsoFromFacolta = async (req, res) => {
  try {
    const { corsoId } = req.body;
    
    if (!corsoId) {
      return res.status(400).json({
        success: false,
        message: 'ID del corso obbligatorio'
      });
    }
    
    const facolta = await Facolta.findById(req.params.id);
    
    if (!facolta) {
      return res.status(404).json({
        success: false,
        message: 'Facoltà non trovata'
      });
    }
    
    // Verifica se il corso è associato alla facoltà
    if (!facolta.corsi.includes(corsoId)) {
      return res.status(400).json({
        success: false,
        message: 'Corso non associato a questa facoltà'
      });
    }
    
    facolta.corsi = facolta.corsi.filter(corso => corso.toString() !== corsoId);
    await facolta.save();
    
    res.status(200).json({
      success: true,
      data: facolta
    });
  } catch (error) {
    console.error('Errore durante la rimozione del corso dalla facoltà:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la rimozione del corso dalla facoltà. Riprova più tardi.'
    });
  }
};
