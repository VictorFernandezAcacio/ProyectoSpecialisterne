const pool = require('../db');

exports.listarReseñas = async (req, res) => {
  const result = await pool.query('SELECT * FROM reseñas');
  res.json(result.rows);
};

exports.obtenerReseña = async (req, res) => {
  const result = await pool.query('SELECT * FROM reseñas WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
};

exports.crearReseña = async (req, res) => {
  const { usuario_id, viaje_id, comentario, puntuacion } = req.body;
  const result = await pool.query(
    'INSERT INTO reseñas (usuario_id, viaje_id, comentario, puntuacion) VALUES ($1,$2,$3,$4) RETURNING *',
    [usuario_id, viaje_id, comentario, puntuacion]
  );
  res.status(201).json(result.rows[0]);
};

exports.actualizarReseña = async (req, res) => {
  const { comentario, puntuacion } = req.body;
  await pool.query('UPDATE reseñas SET comentario=$1, puntuacion=$2 WHERE id=$3', [comentario, puntuacion, req.params.id]);
  res.json({ message: 'Reseña actualizada' });
};

exports.eliminarReseña = async (req, res) => {
  await pool.query('DELETE FROM reseñas WHERE id=$1', [req.params.id]);
  res.json({ message: 'Reseña eliminada' });
};
