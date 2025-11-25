const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');

router.post('/', reservasController.crearReserva);
router.get('/', reservasController.obtenerReservas);
router.get('/:id', reservasController.obtenerReserva);
router.put('/:id', reservasController.actualizarReserva);
router.delete('/:id', reservasController.eliminarReserva);

// Relacionados
router.get('/usuario/:id', reservasController.obtenerReservasUsuario);
router.get('/viaje/:id', reservasController.obtenerReservasViaje);

module.exports = router;
