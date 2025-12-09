const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajesController');
const verificarAdmin = require('../../middleware/verificarAdmin');

// CRUD de viajes
router.post('/', verificarAdmin, viajesController.crearViaje);
router.get('/', viajesController.obtenerViajes);
router.get('/:id', viajesController.obtenerViaje);
router.put('/:id', verificarAdmin, viajesController.actualizarViaje);
router.delete('/:id', verificarAdmin, viajesController.eliminarViaje);

// Extras (públicos)
router.get('/:id/resenas', viajesController.obtenerResenasViaje);
router.get('/:id/alojamientos', viajesController.obtenerAlojamientosViaje);
router.get('/:id/transportes', viajesController.obtenerTransportesViaje);

module.exports = router;
