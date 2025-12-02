const pool = require('../db');
const admin = require("../firebase");

// Crear viaje
exports.crearViaje = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO viajes 
       (nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear viaje:', err);
    res.status(500).send('Error al crear viaje');
  }
};

// Obtener todos los viajes
exports.obtenerViajes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM viajes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener viajes:', err);
    res.status(500).send('Error al obtener viajes');
  }
};

// Obtener viaje por ID
exports.obtenerViaje = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM viajes WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener viaje:', err);
    res.status(500).send('Error al obtener viaje');
  }
};

// Actualizar viaje
exports.actualizarViaje = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte } = req.body;
  try {
    await pool.query(
      `UPDATE viajes 
       SET nombre=$1, descripcion=$2, fecha_inicio=$3, fecha_fin=$4, origen=$5, destino=$6, precio=$7, plazas_disponibles=$8, descuento=$9, id_transporte=$10, updated_at=now() 
       WHERE id=$11`,
      [nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte, req.params.id]
    );
    res.json({ message: 'Viaje actualizado' });
  } catch (err) {
    console.error('Error al actualizar viaje:', err);
    res.status(500).send('Error al actualizar viaje');
  }
};

// Eliminar viaje
exports.eliminarViaje = async (req, res) => {
  try {
    await pool.query('DELETE FROM viajes WHERE id=$1', [req.params.id]);
    res.json({ message: 'Viaje eliminado' });
  } catch (err) {
    console.error('Error al eliminar viaje:', err);
    res.status(500).send('Error al eliminar viaje');
  }
};

// Reseñas de un viaje
exports.obtenerResenasViaje = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resenas WHERE id_viaje=$1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reseñas del viaje:', err);
    res.status(500).send('Error al obtener reseñas del viaje');
  }
};

// Alojamientos de un viaje
exports.obtenerAlojamientosViaje = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM alojamiento WHERE id_viaje=$1',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener alojamientos del viaje:', err);
    res.status(500).send('Error al obtener alojamientos del viaje');
  }
};


// Transportes de un viaje
exports.obtenerTransportesViaje = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.* 
       FROM viajes v 
       JOIN transporte t ON v.id_transporte = t.id 
       WHERE v.id=$1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener transportes del viaje:', err);
    res.status(500).send('Error al obtener transportes del viaje');
  }
};

