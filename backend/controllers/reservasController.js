const pool = require('../db');
const admin = require("../firebase"); // inicialización de Firebase Admin

// Crear reserva (con validación de duplicados y Firebase Auth)
exports.crearReserva = async (req, res) => {
  try {
    // Obtener token JWT de Firebase desde el header Authorization
    const token = req.headers.authorization?.split(" ")[1]; // <-- CORREGIDO
    if (!token) {
      return res.status(401).json({ error: "Token de autenticación requerido" });
    }

    // Verificar token con Firebase Admin
    const decoded = await admin.auth().verifyIdToken(token);
    const uidFirebase = decoded.uid; // UID real del usuario en Firebase

    // Buscar el usuario en tu tabla 'usuarios' usando el UID
    const resultUser = await pool.query(
      "SELECT id FROM usuarios WHERE uid = $1",
      [uidFirebase]
    );

    if (resultUser.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const usuario_id = resultUser.rows[0].id; // ID numérico de tu tabla usuarios

    const { viaje_id, estado } = req.body;
    if (!viaje_id) {
      return res.status(400).json({ error: "viaje_id es obligatorio" });
    }

    // Comprobar si ya existe una reserva para este usuario y viaje
    const check = await pool.query(
      `SELECT 1 FROM reservas WHERE usuario_id = $1 AND viaje_id = $2`,
      [usuario_id, viaje_id]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ error: "Ya has reservado este viaje" });
    }

    // Crear la reserva
    const result = await pool.query(
      `INSERT INTO reservas (usuario_id, viaje_id, estado, fecha_reserva) 
       VALUES ($1, $2, COALESCE($3::estado_reserva, 'confirmada'::estado_reserva), NOW()) 
       RETURNING *`,
      [usuario_id, viaje_id, estado]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear reserva:", err);
    res.status(500).json({ error: "Error al crear reserva" });
  }
};

// Listar todas las reservas con datos del viaje
exports.obtenerReservas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      ORDER BY r.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// Obtener reserva por ID con datos del viaje
exports.obtenerReserva = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      WHERE r.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener reserva:", err);
    res.status(500).json({ error: "Error al obtener reserva" });
  }
};

// Actualizar reserva (ej. cambiar estado)
exports.actualizarReserva = async (req, res) => {
  const { estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reservas 
       SET estado=$1::estado_reserva, fecha_reserva=NOW() 
       WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar reserva:", err);
    res.status(500).json({ error: "Error al actualizar reserva" });
  }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM reservas WHERE id=$1 RETURNING *", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json({ message: "Reserva eliminada con éxito" });
  } catch (err) {
    console.error("Error al eliminar reserva:", err);
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
};

// Reservas de un usuario con datos de viaje
// Reservas de un usuario con datos de viaje + descuento + valoración
exports.obtenerReservasUsuario = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id, 10);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const query = `
      SELECT
        r.id,
        r.usuario_id,
        r.viaje_id,
        r.estado,
        r.fecha_reserva,

        v.nombre AS viaje_nombre,
        v.origen,
        v.destino,
        v.fecha_inicio,
        v.fecha_fin,
        v.imagen,

        v.precio AS precio_original,
        d.porcentaje,

        CASE 
          WHEN d.id_descuento IS NOT NULL
               AND d.activo = true
               AND d.fecha_inicio <= CURRENT_DATE
               AND d.fecha_fin >= CURRENT_DATE
          THEN ROUND(v.precio * (100 - LEAST(d.porcentaje, 99)) / 100.0, 2)
          ELSE v.precio
        END AS precio_final,

        COALESCE(AVG(res.valoracion), NULL) AS valoracion_media

      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN descuentos d ON v.descuento = d.id_descuento
      LEFT JOIN resenas res ON res.id_viaje = v.id

      WHERE r.usuario_id = $1

      GROUP BY
        r.id,
        v.id,
        d.id_descuento,
        d.porcentaje,
        d.activo,
        d.fecha_inicio,
        d.fecha_fin

      ORDER BY r.fecha_reserva DESC
    `;

    const result = await pool.query(query, [usuarioId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener reservas del usuario:", err);
    res.status(500).json({
      error: "Error al obtener reservas del usuario",
      detalle: err.message
    });
  }
};

// Reservas de un viaje con datos de usuario
exports.obtenerReservasViaje = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.usuario_id, r.viaje_id, r.estado, r.fecha_reserva,
             u.nombre AS usuario_nombre, u.email,
             v.nombre AS viaje_nombre, v.destino, v.fecha_inicio, v.fecha_fin, v.precio
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.viaje_id = $1
      ORDER BY r.id ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener reservas del viaje:", err);
    res.status(500).json({ error: "Error al obtener reservas del viaje" });
  }
};
