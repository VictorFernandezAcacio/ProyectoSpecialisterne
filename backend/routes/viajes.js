const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajesController');

// CRUD de viajes
router.post('/', viajesController.crearViaje);
router.get('/', viajesController.obtenerViajes);
router.get('/:id', viajesController.obtenerViaje);
router.put('/:id', viajesController.actualizarViaje);
router.delete('/:id', viajesController.eliminarViaje);

// Extras
router.get('/:id/resenas', viajesController.obtenerResenasViaje);
router.get('/:id/alojamientos', viajesController.obtenerAlojamientosViaje);
router.get('/:id/transportes', viajesController.obtenerTransportesViaje);

module.exports = router;
