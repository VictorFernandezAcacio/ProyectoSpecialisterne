const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/', usuariosController.crearUsuario);
router.get('/:id', usuariosController.obtenerUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);

router.post('/login', usuariosController.login);
router.get('/:id/resenas', usuariosController.obtenerReseñasUsuario);
router.get('/:id/viajes', usuariosController.obtenerViajesUsuario);

module.exports = router;
