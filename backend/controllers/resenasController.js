const pool = require('../db');
const admin = require("../firebase");

exports.listarResenas = async (req, res) => {
  const result = await pool.query('SELECT * FROM resenas');
  res.json(result.rows);
};

exports.obtenerResena = async (req, res) => {
  const result = await pool.query('SELECT * FROM resenas WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
};

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


exports.eliminarResena = async (req, res) => {
  await pool.query('DELETE FROM resenas WHERE id=$1', [req.params.id]);
  res.json({ message: 'Reseña eliminada' });
};
