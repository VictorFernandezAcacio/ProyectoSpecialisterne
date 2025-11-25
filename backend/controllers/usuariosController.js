const pool = require('../db');

// Crear usuario
exports.crearUsuario = async (req, res) => {
  const { usuario, email, contrasena_hash, fecha_nacimiento, tipo_usuario } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios 
       (usuario, email, contrasena_hash, fecha_nacimiento, tipo_usuario) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario, email, contrasena_hash, fecha_nacimiento, tipo_usuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).send('Error al crear usuario');
  }
};

// Obtener usuario por ID
exports.obtenerUsuario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).send('Error al obtener usuario');
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  const { usuario, email, tipo_usuario } = req.body;
  try {
    await pool.query(
      `UPDATE usuarios 
       SET usuario=$1, email=$2, tipo_usuario=$3, updated_at=now() 
       WHERE id=$4`,
      [usuario, email, tipo_usuario, req.params.id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).send('Error al actualizar usuario');
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).send('Error al eliminar usuario');
  }
};

// Login (email + contrasena_hash)
exports.login = async (req, res) => {
  const { email, contrasena_hash } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email=$1 AND contrasena_hash=$2',
      [email, contrasena_hash]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Login correcto', usuario: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error en login');
  }
};

// Reseñas de usuario
exports.obtenerReseñasUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resenas WHERE id_usuario=$1',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
    res.status(500).send('Error al obtener reseñas');
  }
};


// Viajes de usuario (a través de reservas)
exports.obtenerViajesUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.* 
       FROM reservas r 
       JOIN viajes v ON r.viaje_id = v.id 
       WHERE r.usuario_id=$1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener viajes:', err);
    res.status(500).send('Error al obtener viajes');
  }
};
