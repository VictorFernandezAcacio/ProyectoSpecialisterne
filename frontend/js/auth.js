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
  limpiarErrores();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

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
    const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
    const idToken = await userCredential.user.getIdToken();

    // 2. Validar contra tu backend
    const response = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error en login");

    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    alert("Inicio de sesión correcto");
    window.location.href = "../html/Inicio.html";
  } catch (err) {
    mostrarError("error_contrasena", err.message || "Error al iniciar sesión");
  }
}

document.getElementById("btn_iniciar").addEventListener("click", Iniciar_Sesion);
document.getElementById("btn_registro").addEventListener("click", function () {
  window.location.href = "../html/pagina_registro.html";
});
