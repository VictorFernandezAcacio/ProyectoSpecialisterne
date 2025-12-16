const express = require('express');
const cors = require('cors');
const path = require('path');
const serverless = require('serverless-http');
const pool = require('../db');


const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend (opcional en Vercel, normalmente se despliega por separado)
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const viajesRoutes = require('./routes/viajes');
const transportesRoutes = require('./routes/transportes');
const alojamientosRoutes = require('./routes/alojamientos');
const resenasRoutes = require('./routes/resenas');
const reservasRoutes = require('./routes/reservas');
const descuentosRoutes = require('./routes/descuentos');

// Montar rutas (prefijo /api si quieres mantener consistencia)
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/viajes', viajesRoutes);
app.use('/api/transportes', transportesRoutes);
app.use('/api/alojamientos', alojamientosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/descuentos', descuentosRoutes);

// Ruta raíz
app.get('/api', (req, res) => {
  res.send('Backend funcionando en Vercel 🚀');
});

// Exportar como función serverless
module.exports = app;
module.exports.handler = serverless(app);
