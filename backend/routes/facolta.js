const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const facoltaController = require('../controllers/facolta');
const { protect, authorize } = require('../middleware/auth');

// Rotte pubbliche
router.get('/', facoltaController.getFacolta);
router.get('/:id', facoltaController.getSingleFacolta);

// Rotte protette (solo admin)
router.post(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  [
    check('nome', 'Il nome della facoltà è obbligatorio').not().isEmpty()
  ],
  facoltaController.createFacolta
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  facoltaController.updateFacolta
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  facoltaController.deleteFacolta
);

router.put(
  '/:id/addcorso',
  protect,
  authorize('admin', 'superadmin'),
  facoltaController.addCorsoToFacolta
);

router.put(
  '/:id/removecorso',
  protect,
  authorize('admin', 'superadmin'),
  facoltaController.removeCorsoFromFacolta
);

module.exports = router;
