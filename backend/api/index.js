const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexión a la base de datos
let pool;
try {
  pool = require('../db');
} catch (err) {
  console.error('Error al cargar db.js:', err);
}

// 🚫 Comentado: servir frontend desde backend (no recomendado en Vercel)
// app.use(express.static(path.join(__dirname, '../frontend')));

// 📦 Importar rutas
try {
  app.use('/api/usuarios', require('../routes/usuarios'));
  app.use('/api/viajes', require('../routes/viajes'));
  app.use('/api/transportes', require('../routes/transportes'));
  app.use('/api/alojamientos', require('../routes/alojamientos'));
  app.use('/api/resenas', require('../routes/resenas'));
  app.use('/api/reservas', require('../routes/reservas'));
  app.use('/api/descuentos', require('../routes/descuentos'));
} catch (err) {
  console.error('Error al cargar rutas:', err);
}

// 🏠 Ruta raíz
app.get('/api', (req, res) => {
  res.send('Backend funcionando en Vercel 🚀');
});

// 🚀 Exportar como función serverless
module.exports = app;
module.exports.handler = serverless(app);
