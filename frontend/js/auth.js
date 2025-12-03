import { loginEmailPassword, logout } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const btnIniciar = document.getElementById("btn_iniciar");
  const btnRegistro = document.getElementById("btn_registro");

  // Botón INICIAR SESIÓN
  btnIniciar.addEventListener("click", async () => {
    try {
      await loginEmailPassword(correo.value.trim(), contrasena.value.trim());
      console.log("Sesión iniciada correctamente");
      // Redirigir al inicio
      window.location.href = "../html/inicio.html";
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
      alert("Error al iniciar sesión: " + (e.message || e));
    }
  });

  // Botón REGISTRO
  btnRegistro.addEventListener("click", () => {
    // Redirigir a la página de registro
    window.location.href = "../html/pagina_registro.html";
  });
});
