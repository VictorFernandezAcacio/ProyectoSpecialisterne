const express = require('express');
const router = express.Router();
const transportesController = require('../controllers/transportesController');
const pool = require('../db'); 

router.get('/', transportesController.listarTransportes);
router.get('/:id', transportesController.obtenerTransporte);
router.post('/', transportesController.crearTransporte);
router.put('/:id', transportesController.actualizarTransporte);
router.delete('/:id', transportesController.eliminarTransporte);

module.exports = router;
