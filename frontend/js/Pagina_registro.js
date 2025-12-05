import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

function mostrarError(msg) {
  const box = document.getElementById("mensaje_de_error");
  box.style.display = "block";
  box.textContent = msg;
}

function limpiarError() {
  const box = document.getElementById("mensaje_de_error");
  box.style.display = "none";
  box.textContent = "";
}

async function registrarse() {
  limpiarError();

  const usuario = document.getElementById("usuario").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasenya = document.getElementById("contrasenya").value.trim();
  const confirmar = document.getElementById("confirmar_contrasenya").value.trim();
  const fecha_nacimiento = document.getElementById("fecha_de_nacimiento").value;

  if (!usuario || !correo || !contrasenya || !confirmar) return mostrarError("Por favor, complete todos los campos.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return mostrarError("El correo no parece válido.");
  if (contrasenya.length < 8) return mostrarError("La contraseña es demasiado corta.");
  if (contrasenya !== confirmar) return mostrarError("Las contraseñas no coinciden.");

  try {
    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario,
        email: correo,
        password: contrasenya,      
        fecha_nacimiento,
        tipo_usuario: "cliente"
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al crear usuario en la BBDD");

    localStorage.setItem("usuario", JSON.stringify(data));
    alert("Registro completado. Inicia sesión para continuar.");
    window.location.href = "./inicio_sesion.html";
  } catch (err) {
    mostrarError(err.message || "Error en el registro");
  }
}

// 👉 Nueva función para el botón del banner
function volverLogin() {
  window.location.href = "./inicio_sesion.html";
}

// Exponer funciones al scope global
window.registrarse = registrarse;
window.volverLogin = volverLogin;
