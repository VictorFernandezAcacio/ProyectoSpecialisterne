const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajesController');

router.get('/', viajesController.obtenerViajes);
router.get('/:id', viajesController.obtenerViaje);
router.post('/', viajesController.crearViaje);
router.put('/:id', viajesController.actualizarViaje);
router.delete('/:id', viajesController.eliminarViaje);

router.get('/:id/resenas', viajesController.obtenerResenasViaje);
router.get('/:id/alojamientos', viajesController.obtenerAlojamientosViaje);
router.get('/:id/transportes', viajesController.obtenerTransportesViaje);

//router.post('/:id/reservar', viajesController.reservarViaje); // ⚠️ crea stub o elimina

module.exports = router;
