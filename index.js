// index.js
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());


// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const viajesRoutes = require('./routes/viajes');
const transportesRoutes = require('./routes/transportes');
const alojamientosRoutes = require('./routes/alojamientos');
const reseñasRoutes = require('./routes/resenas');
const reservasRoutes = require('./routes/reservas'); // 👈 añadido

// Montar rutas
app.use('/usuarios', usuariosRoutes);
app.use('/viajes', viajesRoutes);
app.use('/transportes', transportesRoutes);
app.use('/alojamientos', alojamientosRoutes);
app.use('/resenas', reseñasRoutes);
app.use('/reservas', reservasRoutes); // 👈 añadido

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT} 🚀`);
});




// CONECTAR EL FRONTED Y BASE DE DATOS

const router = express.Router();

// GET → obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST → crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT → actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    const result = await pool.query(
      'UPDATE usuarios SET nombre=$1, email=$2 WHERE id=$3 RETURNING *',
      [nombre, email, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE → eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);

    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
