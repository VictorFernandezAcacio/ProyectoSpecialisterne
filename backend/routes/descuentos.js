const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const descuentosController = require('../controllers/descuentosController');

router.get('/', descuentosController.obtenerDescuentos);
router.get('/activos', descuentosController.obtenerDescuentosActivos);
router.get('/:id', descuentosController.obtenerDescuento);
router.post('/', descuentosController.crearDescuento);
router.put('/:id', descuentosController.actualizarDescuento);
router.delete('/:id', descuentosController.eliminarDescuento);

module.exports = router;
