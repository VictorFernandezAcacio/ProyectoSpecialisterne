const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenasController');

// Listar todas las reseñas
router.get('/', resenasController.listarResenas);

// Listar reseñas de un viaje concreto
router.get('/viaje/:id_viaje', resenasController.listarResenasPorViaje);

// Obtener una reseña concreta
router.get('/:id', resenasController.obtenerResena);

// Crear nueva reseña (formato esperado por frontend: POST /viajes/:id/resenas)
router.post('/viaje/:id_viaje', resenasController.crearResena);

// Actualizar reseña
router.put('/:id', resenasController.actualizarResena);

// Eliminar reseña
router.delete('/:id', resenasController.eliminarResena);

module.exports = router;
