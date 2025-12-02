const pool = require('../db');
const admin = require("../firebase");

// Crear reserva
exports.crearReserva = async (req, res) => {
  const { usuario_id, viaje_id, estado } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reservas (usuario_id, viaje_id, estado) 
       VALUES ($1, $2, COALESCE($3::estado_reserva, 'confirmada'::estado_reserva)) 
       RETURNING *`,
      [usuario_id, viaje_id, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).send('Error al crear reserva');
  }
};

// Listar todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).send('Error al obtener reservas');
  }
};

// Obtener reserva por ID
exports.obtenerReserva = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).send('Error al obtener reserva');
  }
};

// Actualizar reserva (ej. cambiar estado)
exports.actualizarReserva = async (req, res) => {
  const { estado } = req.body;
  try {
    await pool.query(
      `UPDATE reservas 
       SET estado=$1::estado_reserva, fecha_reserva=CURRENT_DATE 
       WHERE id=$2`,
      [estado, req.params.id]
    );
    res.json({ message: 'Reserva actualizada' });
  } catch (err) {
    console.error('Error al actualizar reserva:', err);
    res.status(500).send('Error al actualizar reserva');
  }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    await pool.query('DELETE FROM reservas WHERE id=$1', [req.params.id]);
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error('Error al eliminar reserva:', err);
    res.status(500).send('Error al eliminar reserva');
  }
};

// Reservas de un usuario
exports.obtenerReservasUsuario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas WHERE usuario_id=$1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas del usuario:', err);
    res.status(500).send('Error al obtener reservas del usuario');
  }
};

// Reservas de un viaje
exports.obtenerReservasViaje = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas WHERE viaje_id=$1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas del viaje:', err);
    res.status(500).send('Error al obtener reservas del viaje');
  }
};
