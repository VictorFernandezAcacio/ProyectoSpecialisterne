const pool = require('../db');
const admin = require("../firebase");

// Listar todas las reseñas con nombre de usuario
exports.listarResenas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.id_usuario, r.id_viaje, r.fecha_resena, r.valoracion, r.resena_texto,
             u.usuario AS nombre_usuario
      FROM resenas r
      JOIN usuarios u ON r.id_usuario = u.id
      ORDER BY r.fecha_resena DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar reseñas:', err);
    res.status(500).send('Error al listar reseñas');
  }
};

// Listar reseñas de un viaje concreto con nombre de usuario
exports.listarResenasPorViaje = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.id_usuario, r.id_viaje, r.fecha_resena, r.valoracion, r.resena_texto,
             u.usuario AS nombre_usuario
      FROM resenas r
      JOIN usuarios u ON r.id_usuario = u.id
      WHERE r.id_viaje = $1
      ORDER BY r.fecha_resena DESC
    `, [req.params.id_viaje]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar reseñas por viaje:', err);
    res.status(500).send('Error al listar reseñas por viaje');
  }
};

// Obtener una reseña concreta con nombre de usuario
exports.obtenerResena = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.id_usuario, r.id_viaje, r.fecha_resena, r.valoracion, r.resena_texto,
             u.usuario AS nombre_usuario
      FROM resenas r
      JOIN usuarios u ON r.id_usuario = u.id
      WHERE r.id=$1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener reseña:', err);
    res.status(500).send('Error al obtener reseña');
  }
};

// Crear nueva reseña
exports.crearResena = async (req, res) => {
  const { id_usuario, id_viaje, fecha_resena, valoracion, resena_texto } = req.body;

  if (!id_usuario || !id_viaje || !fecha_resena || !valoracion || !resena_texto) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO resenas (id_usuario, id_viaje, fecha_resena, valoracion, resena_texto)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, id_viaje, fecha_resena, valoracion, resena_texto]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear reseña:', err);
    res.status(500).send('Error al crear reseña');
  }
};

// Actualizar reseña existente
exports.actualizarResena = async (req, res) => {
  const { fecha_resena, valoracion, resena_texto } = req.body;

  try {
    const result = await pool.query(
      `UPDATE resenas 
       SET fecha_resena=$1, valoracion=$2, resena_texto=$3, updated_at=now()
       WHERE id=$4 RETURNING *`,
      [fecha_resena, valoracion, resena_texto, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    res.json({ message: 'Reseña actualizada', resena: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar reseña:', err);
    res.status(500).send('Error al actualizar reseña');
  }
};

// Eliminar reseña
exports.eliminarResena = async (req, res) => {
  try {
    await pool.query('DELETE FROM resenas WHERE id=$1', [req.params.id]);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    console.error('Error al eliminar reseña:', err);
    res.status(500).send('Error al eliminar reseña');
  }
};
