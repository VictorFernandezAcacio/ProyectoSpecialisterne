const pool = require('../db');

// Función auxiliar para validar fechas
function validarFechasViaje(fecha_inicio, fecha_fin) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);

  if (isNaN(inicio) || isNaN(fin)) {
    return 'Las fechas proporcionadas no son válidas.';
  }
  if (inicio < hoy) {
    return 'No puedes crear o editar un viaje con una fecha de inicio pasada.';
  }
  if (fin < hoy) {
    return 'No puedes crear o editar un viaje con una fecha de fin pasada.';
  }
  if (inicio >= fin) {
    return 'La fecha de inicio debe ser anterior a la fecha de fin.';
  }
  return null;
}

// Función auxiliar para validar campos obligatorios
function validarCamposObligatorios(body) {
  const obligatorios = [
    'nombre',
    'descripcion',
    'fecha_inicio',
    'fecha_fin',
    'origen',
    'destino',
    'precio',
    'plazas_disponibles',
    'id_transporte' // obligatorio
  ];
  for (const campo of obligatorios) {
    if (body[campo] === undefined || body[campo] === null) {
      return `El campo "${campo}" es obligatorio.`;
    }
    if (typeof body[campo] === 'string' && body[campo].trim() === '') {
      return `El campo "${campo}" es obligatorio.`;
    }
  }
  return null;
}

// Función auxiliar para validar tipos y rangos
function validarTipos(body) {
  const precioNum = Number(body.precio);
  const plazasNum = Number(body.plazas_disponibles);
  const transporteNum = Number(body.id_transporte);

  if (!Number.isFinite(precioNum)) {
    return 'El campo "precio" debe ser numérico.';
  }
  if (precioNum <= 0) {
    return 'El campo "precio" debe ser mayor que 0.';
  }
  if (!Number.isFinite(plazasNum) || !Number.isInteger(plazasNum)) {
    return 'El campo "plazas_disponibles" debe ser un entero.';
  }
  if (plazasNum < 0) {
    return 'El campo "plazas_disponibles" no puede ser negativo.';
  }
  if (!Number.isFinite(transporteNum) || !Number.isInteger(transporteNum)) {
    return 'El campo "id_transporte" debe ser un entero.';
  }
  return null;
}

// Normaliza descuentos a null si vienen vacíos o cero
function normalizarDescuento(descuento) {
  return !descuento || descuento === '0' || descuento === 0 ? null : descuento;
}

// Crear viaje
exports.crearViaje = async (req, res) => {
  try {
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
      imagen
    } = req.body;

    const errorCampos = validarCamposObligatorios(req.body);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    const errorTipos = validarTipos(req.body);
    if (errorTipos) return res.status(400).json({ error: errorTipos });

    const errorFechas = validarFechasViaje(fecha_inicio, fecha_fin);
    if (errorFechas) return res.status(400).json({ error: errorFechas });

    const descuentoFinal = normalizarDescuento(descuento);

    const result = await pool.query(
      `INSERT INTO viajes 
       (nombre, descripcion, fecha_inicio, fecha_fin, origen, destino, precio, plazas_disponibles, descuento, id_transporte, imagen) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        origen,
        destino,
        Number(precio),
        Number(plazas_disponibles),
        descuentoFinal,
        Number(id_transporte),
        imagen || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear viaje:', err);
    if (err.code === '22P02') {
      return res.status(400).json({
        error: 'Error de formato en los datos enviados',
        detalle: 'Algún campo numérico recibió un valor vacío o no numérico'
      });
    }
    res.status(500).json({ error: 'Error al crear viaje', detalle: err.message });
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
    res.status(500).json({ error: 'Error al obtener viajes', detalle: err.message });
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
    res.status(500).json({ error: 'Error al obtener viaje', detalle: err.message });
  }
};

// Actualizar viaje
exports.actualizarViaje = async (req, res) => {
  try {
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
      imagen
    } = req.body;

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const errorCampos = validarCamposObligatorios(req.body);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    const errorTipos = validarTipos(req.body);
    if (errorTipos) return res.status(400).json({ error: errorTipos });

    const errorFechas = validarFechasViaje(fecha_inicio, fecha_fin);
    if (errorFechas) return res.status(400).json({ error: errorFechas });

    const descuentoFinal = normalizarDescuento(descuento);

    const result = await pool.query(
      `UPDATE viajes 
       SET nombre=$1, descripcion=$2, fecha_inicio=$3, fecha_fin=$4, origen=$5, destino=$6, precio=$7, plazas_disponibles=$8, descuento=$9, id_transporte=$10, imagen=$11, updated_at=now() 
       WHERE id=$12 RETURNING *`,
      [
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        origen,
        destino,
        Number(precio),
        Number(plazas_disponibles),
        descuentoFinal,
        Number(id_transporte),
        imagen || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar viaje:', err);
    if (err.code === '22P02') {
      return res.status(400).json({
        error: 'Error de formato en los datos enviados',
        detalle: 'Algún campo numérico recibió un valor vacío o no numérico'
      });
    }
    res.status(500).json({ error: 'Error al actualizar viaje', detalle: err.message });
  }
};

// Eliminar viaje
exports.eliminarViaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const result = await pool.query('DELETE FROM viajes WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    res.json({ message: 'Viaje eliminado' });
  } catch (err) {
    console.error('Error al eliminar viaje:', err);
    res.status(500).json({ error: 'Error al eliminar viaje', detalle: err.message });
  }
};

// Reseñas de un viaje
exports.obtenerResenasViaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const result = await pool.query('SELECT * FROM resenas WHERE id_viaje=$1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reseñas del viaje:', err);
    res.status(500).json({ error: 'Error al obtener reseñas del viaje', detalle: err.message });
  }
};

// Alojamientos de un viaje
exports.obtenerAlojamientosViaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const result = await pool.query('SELECT * FROM alojamiento WHERE id_viaje=$1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener alojamientos del viaje:', err);
    res.status(500).json({ error: 'Error al obtener alojamientos del viaje', detalle: err.message });
  }
};

// Transportes de un viaje
exports.obtenerTransportesViaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de viaje inválido' });
    }

    const result = await pool.query(
      `SELECT t.*
       FROM viajes v
       JOIN transporte t ON v.id_transporte = t.id
       WHERE v.id=$1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener transportes del viaje:', err);
    res.status(500).json({ error: 'Error al obtener transportes del viaje', detalle: err.message });
  }
};
