const pool = require('../db');

exports.listarTransportes = async (req, res) => {
  const result = await pool.query('SELECT * FROM transportes');
  res.json(result.rows);
};

exports.obtenerTransporte = async (req, res) => {
  const result = await pool.query('SELECT * FROM transportes WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
};

exports.crearTransporte = async (req, res) => {
  const { tipo, empresa } = req.body;
  const result = await pool.query(
    'INSERT INTO transportes (tipo, empresa) VALUES ($1,$2) RETURNING *',
    [tipo, empresa]
  );
  res.status(201).json(result.rows[0]);
};

exports.actualizarTransporte = async (req, res) => {
  const { tipo, empresa } = req.body;
  await pool.query('UPDATE transportes SET tipo=$1, empresa=$2 WHERE id=$3', [tipo, empresa, req.params.id]);
  res.json({ message: 'Transporte actualizado' });
};

exports.eliminarTransporte = async (req, res) => {
  await pool.query('DELETE FROM transportes WHERE id=$1', [req.params.id]);
  res.json({ message: 'Transporte eliminado' });
};
