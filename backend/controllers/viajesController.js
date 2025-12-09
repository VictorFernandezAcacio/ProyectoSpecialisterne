const pool = require('../db');

// Crear viaje
exports.crearViaje = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      origen,
      destino,
      precio,
      plazas_disponibles,
      descuento,
      id_transporte,
      imagen // aquí guardamos solo el nombre del archivo (ej: Asturias.jpg)
    } = req.body;

    const descuentoFinal = (!descuento || descuento === "0") ? null : descuento;

    const result = await pool.query(
      `INSERT INTO viajes 
       (nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte, imagen) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuentoFinal, id_transporte, imagen]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear viaje:', err);
    res.status(500).send('Error al crear viaje');
  }
};

// Obtener todos los viajes con descuento aplicado
exports.obtenerViajes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id,
             v.nombre,
             v.descripcion,
             v.origen,
             v.destino,
             v.precio,
             v.plazas_disponibles,
             v.fecha_inicio,
             v.fecha_fin,
             v.imagen,
             COALESCE(d.porcentaje, 0) AS porcentaje,
             CASE 
               WHEN d.id_descuento IS NOT NULL
                    AND d.activo = true
                    AND d.fecha_inicio <= CURRENT_DATE
                    AND d.fecha_fin >= CURRENT_DATE
               THEN ROUND(v.precio * (100 - LEAST(d.porcentaje, 99)) / 100.0, 2)
               ELSE NULL
             END AS precio_final
      FROM viajes v
      LEFT JOIN descuentos d
        ON v.descuento = d.id_descuento
      ORDER BY v.id ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener viajes:', err);
    res.status(500).send('Error al obtener viajes');
  }
};

// Obtener viaje por ID
exports.obtenerViaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const result = await pool.query('SELECT * FROM viajes WHERE id=$1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener viaje:', err);
    res.status(500).json({ error: 'Error al obtener viaje' });
  }
};

// Actualizar viaje
exports.actualizarViaje = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      origen,
      destino,
      precio,
      plazas_disponibles,
      descuento,
      id_transporte,
      imagen // igual que en crear, solo nombre del archivo
    } = req.body;

    const descuentoFinal = (!descuento || descuento === "0") ? null : descuento;

    await pool.query(
      `UPDATE viajes 
       SET nombre=$1, descripcion=$2, fecha_inicio=$3, fecha_fin=$4, origen=$5, destino=$6, precio=$7, plazas_disponibles=$8, descuento=$9, id_transporte=$10, imagen=$11, updated_at=now() 
       WHERE id=$12`,
      [nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuentoFinal, id_transporte, imagen, req.params.id]
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
    const result = await pool.query('SELECT * FROM alojamiento WHERE id_viaje=$1', [req.params.id]);
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
