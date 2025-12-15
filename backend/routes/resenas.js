const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenasController');

// Listar todas las reseñas
router.get('/', resenasController.listarResenas);

// Listar reseñas de un viaje concreto
router.get('/viaje/:id_viaje', resenasController.listarResenasPorViaje);

// Obtener una reseña concreta
router.get('/:id', resenasController.obtenerResena);

// Crear nueva reseña
router.post('/', resenasController.crearResena);

// Actualizar reseña
router.put('/:id', resenasController.actualizarResena);

// Eliminar reseña
router.delete('/:id', resenasController.eliminarResena);

module.exports = router;
