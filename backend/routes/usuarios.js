const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const pool = require('../db'); 

// =======================
// RUTAS FIJAS PRIMERO
// =======================

// Crear usuario
router.post('/', usuariosController.crearUsuario);

// Login de usuario
router.post('/login', usuariosController.loginUsuario);

// Cambiar contraseña
router.put('/password', usuariosController.cambiarPassword);

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// RUTAS DINÁMICAS DESPUÉS
// =======================

// Obtener usuario por id
router.get('/:id_usuario', usuariosController.obtenerUsuario);

// Actualizar usuario
router.put('/:id_usuario', usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id_usuario', usuariosController.eliminarUsuario);

// Reseñas de usuario
router.get('/:id_usuario/resenas', usuariosController.obtenerReseñasUsuario);

// Viajes de usuario
router.get('/:id_usuario/viajes', usuariosController.obtenerViajesUsuario);

module.exports = router;
