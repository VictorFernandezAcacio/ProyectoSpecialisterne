// index.js
const express = require('express');
const app = express();

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


