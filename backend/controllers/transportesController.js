const pool = require('../db');
const admin = require("../firebase");

// Listar todos los transportes
exports.listarTransportes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transportes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar transportes:', err);
    res.status(500).send('Error al listar transportes');
  }
};

// Obtener transporte por ID
exports.obtenerTransporte = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transportes WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transporte no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener transporte:', err);
    res.status(500).send('Error al obtener transporte');
  }
};

// Crear transporte
exports.crearTransporte = async (req, res) => {
  const { tipo, fecha_salida, fecha_vuelta, precio, plazas, empresa } = req.body || {};

  if (!tipo || !fecha_salida || !fecha_vuelta || !precio || !plazas || !empresa) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transportes (tipo, fecha_salida, fecha_vuelta, precio, plazas, empresa)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tipo, fecha_salida, fecha_vuelta, precio, plazas, empresa]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear transporte:', err);
    res.status(500).send('Error al crear transporte');
  }
};

// Actualizar transporte
exports.actualizarTransporte = async (req, res) => {
  const { tipo, fecha_salida, fecha_vuelta, precio, plazas, empresa } = req.body || {};

  try {
    const result = await pool.query(
      `UPDATE transportes 
       SET tipo=$1, fecha_salida=$2, fecha_vuelta=$3, precio=$4, plazas=$5, empresa=$6, updated_at=now()
       WHERE id=$7 RETURNING *`,
      [tipo, fecha_salida, fecha_vuelta, precio, plazas, empresa, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transporte no encontrado' });
    }

    res.json({ message: 'Transporte actualizado', transporte: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar transporte:', err);
    res.status(500).send('Error al actualizar transporte');
  }
};

// Eliminar transporte
exports.eliminarTransporte = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM transportes WHERE id=$1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transporte no encontrado' });
    }

    res.json({ message: 'Transporte eliminado' });
  } catch (err) {
    console.error('Error al eliminar transporte:', err);
    res.status(500).send('Error al eliminar transporte');
  }
};
