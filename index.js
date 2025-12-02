const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const viajesRoutes = require('./routes/viajes');
const transportesRoutes = require('./routes/transportes');
const alojamientosRoutes = require('./routes/alojamientos');
const resenasRoutes = require('./routes/resenas');
const reservasRoutes = require('./routes/reservas');

// Montar rutas
app.use('/usuarios', usuariosRoutes);
app.use('/viajes', viajesRoutes);
app.use('/transportes', transportesRoutes);
app.use('/alojamientos', alojamientosRoutes);
app.use('/resenas', resenasRoutes);
app.use('/reservas', reservasRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT} 🚀`);
});
