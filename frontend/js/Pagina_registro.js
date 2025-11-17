const array_de_usuarios = [];

function mostrarError(mensaje) {
  const box = document.getElementById("mensaje_de_error");
  box.style.display = "block";
  box.textContent = mensaje;
}

function limpiarError() {
  const box = document.getElementById("mensaje_de_error");
  box.style.display = "none";
  box.textContent = "";
}

function registrarse() {
  limpiarError();

  const usuario = document.getElementById("usuario").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasenya = document.getElementById("contrasenya").value.trim();
  const confirmar = document.getElementById("confirmar_contrasenya").value.trim();
  const fecha_nacimiento = document.getElementById("fecha_de_nacimiento").value;

  if (!usuario || !correo || !contrasenya || !confirmar) {
    mostrarError("Por favor, complete todos los campos.");
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!emailValido) {
    mostrarError("El correo no parece válido.");
    return;
  }

  if (contrasenya.length < 8) {
    mostrarError("La contraseña es demasiado corta.");
    return;
  }

  if (contrasenya !== confirmar) {
    mostrarError("Las contraseñas no coinciden.");
    return;
  }

  if (fecha_nacimiento && (fecha_nacimiento <= "1909-04-21" || fecha_nacimiento >= "2025-11-14")) {
    mostrarError("Por favor, introduzca su fecha de nacimiento real.");
    return;
  }

  const usuario_actual = {
    username: usuario,
    correo: correo,
    contrasenya: contrasenya,
    fecha_nacimiento: fecha_nacimiento,
  };

  array_de_usuarios.push(usuario_actual);
  console.log("Usuario registrado:", usuario_actual);
  console.log("Usuarios:", array_de_usuarios);

  window.location.href = "../html/Inicio de sesión.html"; 
}
