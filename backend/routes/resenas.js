const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenasController');

router.get('/', resenasController.listarResenas);
router.get('/:id', resenasController.obtenerResena);
router.post('/', resenasController.crearResena);
router.put('/:id', resenasController.actualizarResena);
router.delete('/:id', resenasController.eliminarResena);

module.exports = router;
