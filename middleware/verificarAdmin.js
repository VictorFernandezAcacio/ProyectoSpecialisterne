const admin = require('../backend/firebase');
const pool = require('../backend/db'); // importa tu conexión a Postgres

async function verificarAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificamos el token con Firebase
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Token decodificado:", decoded);

    // Consultamos la BBDD para obtener el rol del usuario
    const result = await pool.query(
      "SELECT tipo_usuario FROM usuarios WHERE uid = $1",
      [decoded.uid]
    );

    const tipoUsuario = result.rows[0]?.tipo_usuario;
    console.log("Rol en BBDD:", tipoUsuario);

    if (tipoUsuario !== "administrador") {
      return res.status(403).json({ error: "Acceso denegado: solo administradores" });
    }

    req.user = { ...decoded, tipo_usuario: tipoUsuario };
    next();
  } catch (err) {
    console.error("Error verificando token:", err);

    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Token caducado. Por favor, inicia sesión de nuevo." });
    }

    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = verificarAdmin;
