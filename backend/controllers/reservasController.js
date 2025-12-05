const pool = require('../db');
const admin = require("../firebase");

// Crear reserva (con validación de duplicados)
exports.crearReserva = async (req, res) => {
  const { usuario_id, viaje_id, estado } = req.body;
  try {
    if (!usuario_id || !viaje_id) {
      return res.status(400).json({ error: 'usuario_id y viaje_id son obligatorios' });
    }

    // Comprobar si ya existe una reserva para este usuario y viaje
    const check = await pool.query(
      `SELECT 1 FROM reservas WHERE usuario_id = $1 AND viaje_id = $2`,
      [usuario_id, viaje_id]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ error: 'Ya has reservado este viaje' });
    }

    // Crear la reserva
    const result = await pool.query(
      `INSERT INTO reservas (usuario_id, viaje_id, estado, fecha_reserva) 
       VALUES ($1, $2, COALESCE($3::estado_reserva, 'confirmada'::estado_reserva), NOW()) 
       RETURNING *`,
      [usuario_id, viaje_id, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

// Listar todas las reservas con datos del viaje
exports.obtenerReservas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      ORDER BY r.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Obtener reserva por ID con datos del viaje
exports.obtenerReserva = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      WHERE r.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
};

// Actualizar reserva (ej. cambiar estado)
exports.actualizarReserva = async (req, res) => {
  const { estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reservas 
       SET estado=$1::estado_reserva, fecha_reserva=NOW() 
       WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar reserva:', err);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reservas WHERE id=$1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada con éxito' });
  } catch (err) {
    console.error('Error al eliminar reserva:', err);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};

// Reservas de un usuario con datos de viaje
exports.obtenerReservasUsuario = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      WHERE r.usuario_id = $1
      ORDER BY r.id ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas del usuario:', err);
    res.status(500).json({ error: 'Error al obtener reservas del usuario' });
  }
};

// Reservas de un viaje con datos de usuario
exports.obtenerReservasViaje = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             u.nombre AS usuario_nombre, u.email,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.viaje_id = $1
      ORDER BY r.id ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reservas del viaje:', err);
    res.status(500).json({ error: 'Error al obtener reservas del viaje' });
  }
};
