const express = require('express');
const router = express.Router();
const alojamientosController = require('../controllers/alojamientosController');
const pool = require('../db'); 


router.get('/', alojamientosController.listarAlojamientos);
router.get('/:id', alojamientosController.obtenerAlojamiento);
router.post('/', alojamientosController.crearAlojamiento);
router.put('/:id', alojamientosController.actualizarAlojamiento);
router.delete('/:id', alojamientosController.eliminarAlojamiento);

module.exports = router;
