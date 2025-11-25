const express = require('express');
const app = express();

app.use(express.json());
const usuariosRoutes = require('./routes/usuarios');
const viajesRoutes = require('./routes/viajes');
const transportesRoutes = require('./routes/transportes');
const alojamientosRoutes = require('./routes/alojamientos');
const reseñasRoutes = require('./routes/reseñas');


app.use('/usuarios', usuariosRoutes);
app.use('/viajes', viajesRoutes);
app.use('/transportes', transportesRoutes);
app.use('/alojamientos', alojamientosRoutes);
app.use('/reseñas', reseñasRoutes);

app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000 🚀');
});

app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

