const pool = require('../db');
const admin = require("../firebase");

// Crear usuario en Firebase + tabla local
exports.crearUsuario = async (req, res) => {
  const { usuario, email, password, fecha_nacimiento, tipo_usuario } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    console.log("UID creado en Firebase:", userRecord.uid);

    const result = await pool.query(
      `INSERT INTO usuarios (uid, usuario, email, fecha_nacimiento, tipo_usuario) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userRecord.uid, usuario, email, fecha_nacimiento, tipo_usuario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "El email ya está registrado en Firebase" });
    }
    console.error("Error al crear usuario:", err);
    res.status(500).send("Error al crear usuario");
  }
};

// Obtener usuario por id_usuario
exports.obtenerUsuario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id=$1', [req.params.id_usuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).send('Error al obtener usuario');
  }
};

// Actualizar usuario por id_usuario
exports.actualizarUsuario = async (req, res) => {
  const { usuario, email, tipo_usuario } = req.body;
  const { id_usuario } = req.params;

  try {
    // Comprobar si el nombre de usuario ya existe
    if (usuario) {
      const existe = await pool.query(
        'SELECT id FROM usuarios WHERE usuario=$1 AND id<>$2',
        [usuario, id_usuario]
      );

      if (existe.rows.length > 0) {
        return res.status(400).json({
          message: 'El nombre de usuario ya está en uso'
        });
      }
    }

    await pool.query(
      `UPDATE usuarios 
       SET usuario=$1, email=$2, tipo_usuario=$3, updated_at=now()
       WHERE id=$4`,
      [usuario, email, tipo_usuario, id_usuario]
    );

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).send('Error al actualizar usuario');
  }
};

// Eliminar usuario (también en Firebase)
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const result = await pool.query('SELECT uid FROM usuarios WHERE id=$1', [id_usuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado en la BBDD" });
    }
    const uid = result.rows[0].uid;

    await admin.auth().deleteUser(uid);
    await pool.query('DELETE FROM usuarios WHERE id=$1', [id_usuario]);

    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).send('Error al eliminar usuario');
  }
};

// Login de usuario con Firebase + tabla local
exports.loginUsuario = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const result = await pool.query(
      `SELECT id, usuario, email, fecha_nacimiento, tipo_usuario, uid
       FROM usuarios
       WHERE uid = $1`,
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado en la BBDD" });
    }

    const usuario = result.rows[0];
    res.status(200).json({
      message: "Login correcto",
      usuario: {
        id: usuario.id,
        uid: usuario.uid,
        correo: usuario.email,
        usuario: usuario.usuario,
        tipo_usuario: usuario.tipo_usuario,
      }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Reseñas de usuario (por usuario_id)
exports.obtenerReseñasUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resenas WHERE usuario_id=$1',
      [req.params.id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
    res.status(500).send('Error al obtener reseñas');
  }
};

// Viajes de usuario (a través de reservas, por usuario_id)
exports.obtenerViajesUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.* 
       FROM reservas r 
       JOIN viajes v ON r.viaje_id = v.id 
       WHERE r.usuario_id=$1`,
      [req.params.id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener viajes:', err);
    res.status(500).send('Error al obtener viajes');
  }
};

exports.cambiarPassword = async (req, res) => {
  const { uid, nuevaPassword } = req.body;

  if (!uid || !nuevaPassword) {
    return res.status(400).json({
      message: 'Faltan datos obligatorios'
    });
  }

  try {
    await admin.auth().updateUser(uid, {
      password: nuevaPassword
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({
      message: 'Error al cambiar la contraseña'
    });
  }
};

