import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

function mostrarError(id, mensaje) {
  document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
  document.getElementById("error_correo").textContent = "";
  document.getElementById("error_contrasena").textContent = "";
}

async function Iniciar_Sesion() {
  console.log("Entrando en Iniciar_Sesion");
  limpiarErrores();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  console.log("Datos introducidos:", { correo, contrasena });

  if (!correo) {
    mostrarError("error_correo", "ERROR: NO SE HA PUESTO EL CORREO");
    return;
  }
  if (!contrasena) {
    mostrarError("error_contrasena", "ERROR: NO SE HA PUESTO LA CONTRASEÑA");
    return;
  }

  try {
    // 1. Login con Firebase
    console.log("Intentando login con Firebase...");
    const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
    console.log("Login Firebase correcto:", userCredential.user.uid);

    const idToken = await userCredential.user.getIdToken();
    console.log("Token Firebase obtenido:", idToken);

    // 2. Validar contra tu backend
    console.log("Llamando al backend /usuarios/login...");
    const response = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    console.log("Respuesta cruda del backend:", response);
    const data = await response.json();
    console.log("Respuesta backend (JSON):", data);

    if (!response.ok) throw new Error(data.message || "Error en login");

    // 3. Guardar usuario en localStorage
    const usuarioGuardado = {
      id: data.usuario.id,
      uid: data.usuario.uid,
      usuario: data.usuario.usuario,
      email: data.usuario.email,
      tipo_usuario: data.usuario.tipo_usuario,
      token: idToken
    };

    localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
    console.log("Usuario guardado en localStorage:", usuarioGuardado);

    // Redirigir al inicio
    window.location.href = "../html/Inicio.html";
  } catch (err) {
    console.error("Error en login:", err);
    mostrarError("error_contrasena", err.message || "Error al iniciar sesión");
  }
}

// Eventos de botones
document.getElementById("btn_iniciar").addEventListener("click", Iniciar_Sesion);
document.getElementById("btn_registro").addEventListener("click", function () {
  window.location.href = "../html/pagina_registro.html";
});
