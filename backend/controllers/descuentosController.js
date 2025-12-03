const pool = require('../db');

// Obtener todos los descuentos
const obtenerDescuentos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM descuentos ORDER BY id_descuento ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener descuentos:', err);
    res.status(500).json({ error: 'Error al obtener descuentos' });
  }
};

// Obtener solo descuentos activos (fecha actual entre inicio y fin y activo = true)
const obtenerDescuentosActivos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM descuentos
      WHERE fecha_inicio <= NOW()
        AND fecha_fin >= NOW()
        AND activo = true
      ORDER BY id_descuento ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener descuentos activos:', err);
    res.status(500).json({ error: 'Error al obtener descuentos activos' });
  }
};

// Obtener un descuento por ID
const obtenerDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM descuentos WHERE id_descuento = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Descuento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener descuento:', err);
    res.status(500).json({ error: 'Error al obtener descuento' });
  }
};

// Crear un nuevo descuento
const crearDescuento = async (req, res) => {
  try {
    const { titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo } = req.body;
    const result = await pool.query(
      `INSERT INTO descuentos (titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear descuento:', err);
    res.status(500).json({ error: 'Error al crear descuento' });
  }
};

// Actualizar un descuento
const actualizarDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo } = req.body;
    const result = await pool.query(
      `UPDATE descuentos
       SET titulo = $1, descripcion = $2, porcentaje = $3, fecha_inicio = $4, fecha_fin = $5, activo = $6
       WHERE id_descuento = $7 RETURNING *`,
      [titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Descuento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar descuento:', err);
    res.status(500).json({ error: 'Error al actualizar descuento' });
  }
};

// Eliminar un descuento
const eliminarDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM descuentos WHERE id_descuento = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Descuento no encontrado' });
    }
    res.json({ mensaje: 'Descuento eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar descuento:', err);
    res.status(500).json({ error: 'Error al eliminar descuento' });
  }
};

module.exports = {
  obtenerDescuentos,
  obtenerDescuentosActivos,
  obtenerDescuento,
  crearDescuento,
  actualizarDescuento,
  eliminarDescuento
};
