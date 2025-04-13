const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const immatricolazioneController = require('../controllers/immatricolazione');
const { protect, authorize } = require('../middleware/auth');

// Rotte pubbliche
router.post(
  '/',
  [
    check('nome', 'Il nome è obbligatorio').not().isEmpty(),
    check('cognome', 'Il cognome è obbligatorio').not().isEmpty(),
    check('email', 'Inserisci un indirizzo email valido').isEmail(),
    check('codiceFiscale', 'Il codice fiscale è obbligatorio').isLength({ min: 16, max: 16 }),
    check('dataNascita', 'La data di nascita è obbligatoria').not().isEmpty(),
    check('luogoNascita', 'Il luogo di nascita è obbligatorio').not().isEmpty(),
    check('indirizzo', 'L\'indirizzo è obbligatorio').not().isEmpty(),
    check('telefono', 'Il numero di telefono è obbligatorio').not().isEmpty(),
    check('tipoImmatricolazione', 'Il tipo di immatricolazione è obbligatorio').isIn(['Immatricolazione standard', 'Abbreviazione Carriera']),
    check('tipoCorso', 'Il tipo di corso è obbligatorio').isIn(['triennale', 'magistrale', 'magistrale a ciclo unico']),
    check('corsoId', 'Il corso di laurea è obbligatorio').not().isEmpty(),
    check('diplomaScuola', 'Il diploma di scuola superiore è obbligatorio').not().isEmpty(),
    check('votoScuola', 'Il voto di diploma è obbligatorio').isInt({ min: 60, max: 100 })
  ],
  immatricolazioneController.createImmatricolazioneRequest
);

router.get('/corsi', immatricolazioneController.getCorsiByFacolta);

// Rotte protette (solo admin)
router.get(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  immatricolazioneController.getImmatricolazioneRequests
);

router.get(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  immatricolazioneController.getImmatricolazioneRequest
);

router.put(
  '/:id/approve',
  protect,
  authorize('admin', 'superadmin'),
  immatricolazioneController.approveImmatricolazioneRequest
);

router.put(
  '/:id/reject',
  protect,
  authorize('admin', 'superadmin'),
  immatricolazioneController.rejectImmatricolazioneRequest
);

module.exports = router;
