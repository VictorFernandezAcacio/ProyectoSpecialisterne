const pool = require('../db');


// Obtener todos los descuentos
exports.obtenerDescuentos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM descuentos ORDER BY id_descuento ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener descuentos:', err);
    res.status(500).json({ error: 'Error al obtener descuentos' });
  }
};

// Obtener descuentos activos (los que están vigentes hoy)
exports.obtenerDescuentosActivos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM descuentos
      WHERE activo = TRUE
      AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
      ORDER BY id_descuento ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener descuentos activos:', err);
    res.status(500).json({ error: 'Error al obtener descuentos activos' });
  }
};

// Obtener un descuento por ID
exports.obtenerDescuento = async (req, res) => {
  const { id } = req.params;
  try {
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
exports.crearDescuento = async (req, res) => {
  const { titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo } = req.body;
  try {
    await pool.query(
      `INSERT INTO descuentos (titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo]
    );
    res.json({ mensaje: 'Descuento creado con éxito' });
  } catch (err) {
    console.error('Error al crear descuento:', err);
    res.status(500).json({ error: 'Error al crear descuento' });
  }
};

// Actualizar descuento
exports.actualizarDescuento = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo } = req.body;
  try {
    await pool.query(
      `UPDATE descuentos
       SET titulo = $1, descripcion = $2, porcentaje = $3,
           fecha_inicio = $4, fecha_fin = $5, activo = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id_descuento = $7`,
      [titulo, descripcion, porcentaje, fecha_inicio, fecha_fin, activo, id]
    );
    res.json({ mensaje: 'Descuento actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar descuento:', err);
    res.status(500).json({ error: 'Error al actualizar descuento' });
  }
};

// Eliminar descuento
exports.eliminarDescuento = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM descuentos WHERE id_descuento = $1', [id]);
    res.json({ mensaje: 'Descuento eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar descuento:', err);
    res.status(500).json({ error: 'Error al eliminar descuento' });
  }
};
