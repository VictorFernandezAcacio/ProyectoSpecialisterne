const BASE_URL = "http://localhost:3000";

// Cargar datos del usuario real
function cargarDatosPerfil() {
  const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
  if (!usuarioLS) {
    alert("No hay sesión activa");
    return;
  }

  const correoInput = document.getElementById("correo");
  const usuarioInput = document.getElementById("usuario");
  const cumpleInput = document.getElementById("cumpleaños");

  if (correoInput) correoInput.value = usuarioLS.correo || "";
  if (usuarioInput) usuarioInput.value = usuarioLS.usuario || "";
  if (cumpleInput) cumpleInput.value = usuarioLS.fecha_nacimiento || "";

  document.getElementById("nueva_contraseña").value = "";
  document.getElementById("confirmar_contraseña").value = "";
}

// Mostrar / ocultar contraseña
function togglePassword(idCampo) {
  const campo = document.getElementById(idCampo);
  if (campo) {
    campo.type = campo.type === "password" ? "text" : "password";
  }
}

// Guardar cambios de perfil (usuario / email)
async function GuardarPerfil() {
  const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
  if (!usuarioLS) return alert("No hay sesión");

  const usuario = document.getElementById("usuario").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (!usuario || !correo) {
    alert("Usuario y correo son obligatorios");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/${usuarioLS.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario,
        email: correo,
        tipo_usuario: usuarioLS.tipo_usuario
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al actualizar usuario");
      return;
    }

    // Actualizar localStorage
    usuarioLS.usuario = usuario;
    usuarioLS.correo = correo;
    localStorage.setItem("usuario", JSON.stringify(usuarioLS));

    alert("Perfil actualizado correctamente ✅");
  } catch (err) {
    console.error(err);
    alert("Error al actualizar perfil");
  }
}

// Cambiar contraseña REAL (Firebase)
async function CambiarContraseña() {
  const nueva = document.getElementById("nueva_contraseña").value;
  const confirmar = document.getElementById("confirmar_contraseña").value;

  if (!nueva || !confirmar) {
    alert("Debes rellenar ambos campos");
    return;
  }

  if (nueva !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const usuarioLS = JSON.parse(localStorage.getItem("usuario"));

  try {
    const res = await fetch(`${BASE_URL}/usuarios/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: usuarioLS.uid,
        nuevaPassword: nueva
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al cambiar contraseña");
      return;
    }

    alert("Contraseña actualizada correctamente 🔐");
    document.getElementById("nueva_contraseña").value = "";
    document.getElementById("confirmar_contraseña").value = "";

  } catch (err) {
    console.error(err);
    alert("Error al cambiar contraseña");
  }
}

// Mostrar ventana de borrar cuenta
function Mostrar_Ventana_Borrar() {
  const alerta = document.getElementById("alerta_borrar");
  if (alerta) alerta.style.display = "block";
}

// Ocultar ventana de borrar cuenta
function Quitar_Ventana_Borrar() {
  const alerta = document.getElementById("alerta_borrar");
  if (alerta) alerta.style.display = "none";
}

// Borrar cuenta REAL (Firebase + BBDD)
async function BorrarCuenta() {
  const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
  if (!usuarioLS) return alert("No hay sesión");

  try {
    const res = await fetch(`${BASE_URL}/usuarios/${usuarioLS.id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("No se pudo borrar la cuenta");
      return;
    }

    localStorage.clear();
    alert("Cuenta eliminada correctamente ❌");
    window.location.href = "Inicio.html";

  } catch (err) {
    console.error(err);
    alert("Error al borrar la cuenta");
  }
}

// Inicialización
window.addEventListener("DOMContentLoaded", cargarDatosPerfil);
