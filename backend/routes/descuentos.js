const express = require('express');
const router = express.Router();
const descuentosController = require('../controllers/descuentosController');

// Rutas de descuentos
router.get('/', descuentosController.obtenerDescuentos);
router.get('/activos', descuentosController.obtenerDescuentosActivos);
router.get('/:id', descuentosController.obtenerDescuento);
router.post('/', descuentosController.crearDescuento);
router.put('/:id', descuentosController.actualizarDescuento);
router.delete('/:id', descuentosController.eliminarDescuento);

module.exports = router;
