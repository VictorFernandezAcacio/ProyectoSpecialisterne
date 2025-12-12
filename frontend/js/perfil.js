// Datos simulados de usuario (mock)
const mockUser = {
    correo: "usuario@example.com",
    usuario: "JuanPerez",
    contraseña: "123456",
    cumpleaños: "1995-08-15"
};

// Cargar datos en los inputs del perfil
function cargarDatosPerfil() {
    const correoInput = document.getElementById("correo");
    const usuarioInput = document.getElementById("usuario");
    const cumpleInput = document.getElementById("cumpleaños");
    const nuevaInput = document.getElementById("nueva_contraseña");
    const confirmarInput = document.getElementById("confirmar_contraseña");

    if (correoInput) correoInput.value = mockUser.correo;
    if (usuarioInput) usuarioInput.value = mockUser.usuario;
    if (cumpleInput) cumpleInput.value = mockUser.cumpleaños;
    if (nuevaInput) nuevaInput.value = "";
    if (confirmarInput) confirmarInput.value = "";
}

// Mostrar/ocultar contraseña
function togglePassword(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.type = campo.type === "password" ? "text" : "password";
    }
}

// Cambiar contraseña
function CambiarContraseña() {
    const nueva = document.getElementById("nueva_contraseña");
    const confirmar = document.getElementById("confirmar_contraseña");

    if (!nueva || !confirmar) {
        alert("Faltan campos de contraseña en el formulario.");
        return;
    }

    const nuevaValue = nueva.value;
    const confirmarValue = confirmar.value;

    if (nuevaValue === "" || confirmarValue === "") {
        alert("Debes rellenar ambos campos.");
        return;
    }

    if (nuevaValue !== confirmarValue) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    mockUser.contraseña = nuevaValue;
    alert("Contraseña cambiada exitosamente (mock).");
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

// Borrar cuenta (mock)
function BorrarCuenta() {
    const inputPassword = document.getElementById("borrar_cuenta");
    if (!inputPassword) {
        alert("Campo de contraseña para borrar cuenta no encontrado.");
        return;
    }

    if (inputPassword.value === mockUser.contraseña) {
        alert("Cuenta borrada exitosamente (mock).");
        Quitar_Ventana_Borrar();
    } else {
        alert("Contraseña incorrecta. Intenta nuevamente.");
    }
}

// Inicializar al cargar la página
window.onload = cargarDatosPerfil;
