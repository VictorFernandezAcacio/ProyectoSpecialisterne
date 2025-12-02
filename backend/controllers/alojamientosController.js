const pool = require('../db');
const admin = require("../firebase");

// Listar todos los alojamientos
exports.listarAlojamientos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alojamiento');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar alojamientos:', err);
    res.status(500).send('Error al listar alojamientos');
  }
};

// Obtener alojamiento por ID
exports.obtenerAlojamiento = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alojamiento WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alojamiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener alojamiento:', err);
    res.status(500).send('Error al obtener alojamiento');
  }
};

// Crear alojamiento
exports.crearAlojamiento = async (req, res) => {
  const {
    nombre,
    tipo_alojamiento,
    fecha_inicio,
    fecha_fin,
    precio,
    regimen_estancia,
    plazas,
    localizacion,
    id_viaje
  } = req.body || {};

  if (
    !nombre || !tipo_alojamiento || !fecha_inicio || !fecha_fin ||
    !precio || !regimen_estancia || !plazas || !localizacion
  ) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alojamiento (
        nombre, tipo_alojamiento, fecha_inicio, fecha_fin, precio,
        regimen_estancia, plazas, localizacion, id_viaje
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nombre, tipo_alojamiento, fecha_inicio, fecha_fin, precio, regimen_estancia, plazas, localizacion, id_viaje]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear alojamiento:', err);
    res.status(500).send('Error al crear alojamiento');
  }
};

// Actualizar alojamiento
exports.actualizarAlojamiento = async (req, res) => {
  const {
    nombre,
    tipo_alojamiento,
    fecha_inicio,
    fecha_fin,
    precio,
    regimen_estancia,
    plazas,
    localizacion,
    id_viaje
  } = req.body || {};

  try {
    const result = await pool.query(
      `UPDATE alojamiento SET
        nombre=$1,
        tipo_alojamiento=$2,
        fecha_inicio=$3,
        fecha_fin=$4,
        precio=$5,
        regimen_estancia=$6,
        plazas=$7,
        localizacion=$8,
        id_viaje=$9,
        updated_at=now()
      WHERE id=$10 RETURNING *`,
      [nombre, tipo_alojamiento, fecha_inicio, fecha_fin, precio, regimen_estancia, plazas, localizacion, id_viaje, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alojamiento no encontrado' });
    }

    res.json({ message: 'Alojamiento actualizado', alojamiento: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar alojamiento:', err);
    res.status(500).send('Error al actualizar alojamiento');
  }
};

// Eliminar alojamiento
exports.eliminarAlojamiento = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM alojamiento WHERE id=$1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alojamiento no encontrado' });
    }

    res.json({ message: 'Alojamiento eliminado' });
  } catch (err) {
    console.error('Error al eliminar alojamiento:', err);
    res.status(500).send('Error al eliminar alojamiento');
  }
};

