// auth.js
import { loginEmailPassword, logout } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const btnIniciar = document.getElementById("btn_iniciar");
  const btnRegistro = document.getElementById("btn_registro");

  btnIniciar.addEventListener("click", async () => {
    try {
      await loginEmailPassword(correo.value, contrasena.value);
      alert("Sesión iniciada. Vuelve a Inicio para reservar.");
    } catch (e) {
      console.error(e);
    }
  });

  btnRegistro.addEventListener("click", async () => {
    alert("Implementa registro o usa una cuenta ya creada en Firebase Auth.");
  });
});
