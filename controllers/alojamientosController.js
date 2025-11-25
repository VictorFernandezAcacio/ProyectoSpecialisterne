const pool = require('../db');

exports.listarAlojamientos = async (req, res) => {
  const result = await pool.query('SELECT * FROM alojamientos');
  res.json(result.rows);
};

exports.obtenerAlojamiento = async (req, res) => {
  const result = await pool.query('SELECT * FROM alojamientos WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
};

exports.crearAlojamiento = async (req, res) => {
  const { nombre, direccion } = req.body;
  const result = await pool.query(
    'INSERT INTO alojamientos (nombre, direccion) VALUES ($1,$2) RETURNING *',
    [nombre, direccion]
  );
  res.status(201).json(result.rows[0]);
};

exports.actualizarAlojamiento = async (req, res) => {
  const { nombre, direccion } = req.body;
  await pool.query('UPDATE alojamientos SET nombre=$1, direccion=$2 WHERE id=$3', [nombre, direccion, req.params.id]);
  res.json({ message: 'Alojamiento actualizado' });
};

exports.eliminarAlojamiento = async (req, res) => {
  await pool.query('DELETE FROM alojamientos WHERE id=$1', [req.params.id]);
  res.json({ message: 'Alojamiento eliminado' });
};
