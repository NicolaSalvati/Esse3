const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword,
  assignMatricola,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

// Rotte pubbliche
router.post('/register', [
  check('name', 'Il nome è obbligatorio').not().isEmpty(),
  check('email', 'Inserisci un indirizzo email valido').isEmail(),
  check('password', 'La password deve contenere almeno 6 caratteri').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Inserisci un indirizzo email valido').isEmail(),
  check('password', 'La password è obbligatoria').exists()
], login);

// Rotte protette
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

// Rotte admin
router.put('/assignmatricola/:id', protect, authorize('admin', 'superadmin'), assignMatricola);
router.get('/users', protect, authorize('admin', 'superadmin'), getUsers);
router.get('/users/:id', protect, authorize('admin', 'superadmin'), getUser);
router.put('/users/:id', protect, authorize('admin', 'superadmin'), updateUser);
router.delete('/users/:id', protect, authorize('admin', 'superadmin'), deleteUser);

module.exports = router;
