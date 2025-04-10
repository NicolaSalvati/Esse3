const User = require('../models/User');
const CorsoLaurea = require('../models/CorsoLaurea');
const { validationResult } = require('express-validator');

// @desc    Registra un nuovo utente
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validazione input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, corso, telefono, indirizzo } = req.body;

    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email già registrata'
      });
    }

    // Crea l'utente con matricola temporanea
    const user = await User.create({
      name,
      email,
      password,
      matricola: 'PENDING', // Sarà assegnata dall'admin
      role: 'student',
      corso,
      telefono: telefono || '',
      indirizzo: indirizzo || '',
      isApproved: false
    });

    // Genera token
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    res.status(201).json({
      success: true,
      message: 'Registrazione completata con successo. Attendi l\'approvazione dell\'amministratore.',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        matricola: user.matricola,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la registrazione. Riprova più tardi.'
    });
  }
};

// @desc    Login utente
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Validazione input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Verifica se l'utente esiste
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica se l'account è bloccato
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(401).json({
        success: false,
        message: `Account bloccato. Riprova tra ${lockTime} minuti.`
      });
    }

    // Verifica la password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Incrementa i tentativi di login falliti
      await user.incrementLoginAttempts();
      
      // Se l'account è stato bloccato dopo questo tentativo
      if (user.isLocked()) {
        const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
        return res.status(401).json({
          success: false,
          message: `Troppe credenziali errate. Account bloccato per ${lockTime} minuti.`
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica se lo studente è approvato
    if (user.role === 'student' && !user.isApproved) {
      return res.status(401).json({
        success: false,
        message: 'Il tuo account è in attesa di approvazione da parte dell\'amministratore.'
      });
    }

    // Reset dei tentativi di login dopo un login riuscito
    await user.resetLoginAttempts();

    // Genera token
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        matricola: user.matricola,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il login. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni utente corrente
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('corso');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Errore durante il recupero del profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero del profilo. Riprova più tardi.'
    });
  }
};

// @desc    Aggiorna profilo utente
// @route   PUT /api/v1/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, telefono, indirizzo } = req.body;
    
    // Campi da aggiornare
    const fieldsToUpdate = {
      name: name || req.user.name,
      telefono: telefono || req.user.telefono,
      indirizzo: indirizzo || req.user.indirizzo
    };
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del profilo. Riprova più tardi.'
    });
  }
};

// @desc    Aggiorna password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verifica input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Inserisci sia la password attuale che la nuova password'
      });
    }
    
    // Ottieni l'utente con la password
    const user = await User.findById(req.user.id).select('+password');
    
    // Verifica la password attuale
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password attuale non corretta'
      });
    }
    
    // Aggiorna la password
    user.password = newPassword;
    await user.save();
    
    // Genera nuovo token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      success: true,
      message: 'Password aggiornata con successo',
      token
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento della password. Riprova più tardi.'
    });
  }
};

// @desc    Assegna matricola a uno studente
// @route   PUT /api/v1/auth/assignmatricola/:id
// @access  Private/Admin
exports.assignMatricola = async (req, res) => {
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
    if (!matricola.startsWith('0124') || matricola.length !== 11) {
      return res.status(400).json({
        success: false,
        message: 'La matricola deve iniziare con 0124 e avere 11 caratteri'
      });
    }
    
    // Verifica se la matricola è già assegnata
    const existingUser = await User.findOne({ matricola });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Questa matricola è già assegnata a un altro studente'
      });
    }
    
    // Aggiorna l'utente
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        matricola,
        isApproved: true 
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: `Matricola ${matricola} assegnata con successo a ${user.name}`
    });
  } catch (error) {
    console.error('Errore durante l\'assegnazione della matricola:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'assegnazione della matricola. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni tutti gli utenti
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Filtra per ruolo se specificato
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    const users = await User.find(filter).populate('corso');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero degli utenti. Riprova più tardi.'
    });
  }
};

// @desc    Ottieni un singolo utente
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('corso');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Errore durante il recupero dell\'utente:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dell\'utente. Riprova più tardi.'
    });
  }
};

// @desc    Aggiorna un utente
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    // Verifica se l'utente esiste
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    
    // Aggiorna l'utente
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento dell\'utente. Riprova più tardi.'
    });
  }
};

// @desc    Elimina un utente
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Verifica se l'utente esiste
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    
    // Elimina l'utente
    await user.remove();
    
    res.status(200).json({
      success: true,
      message: 'Utente eliminato con successo'
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione dell\'utente. Riprova più tardi.'
    });
  }
};
