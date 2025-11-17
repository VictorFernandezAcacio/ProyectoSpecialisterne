const mockUser = {
    correo: "usuario@example.com",
    usuario: "JuanPerez",
    contraseña: "123456",
    cumpleaños: "1995-08-15"
};


function cargarDatosPerfil() {
    document.getElementById("correo").value = mockUser.correo;
    document.getElementById("usuario").value = mockUser.usuario;
//?    document.getElementById("can_contraseña").value = "";
//?    document.getElementById("con_contraseña").value = "";
    document.getElementById("cumpleaños").value = mockUser.cumpleaños;
}


function togglePassword(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }
}


function CambiarContraseña() {
    const actual = document.getElementById("actual_contraseña").value
    const nueva = document.getElementById("nueva_contraseña").value;
    const confirmar = document.getElementById("confirmar_contraseña").value;

    if (nueva === "" || confirmar === "" || actual === "") {
        alert("Debe rellenar todos los campos.");
        return;
    }

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (actual !== mockUser.contraseña) {
        alert("La contraseña introducida es incorrecta.");
        return
    }

    mockUser.contraseña = nueva;
    alert("Contraseña cambiada exitosamente (mock).");
}


function abrirModulo() {
  document.getElementById("overlay").style.display = "flex";
}
function cerrarModulo() {
  document.getElementById("overlay").style.display = "none";
}
function confirmElimCuenta() {
    const contraseña = document.getElementById("actual_contraseña").value
if (contraseña === mockUser.contraseña) {
    cerrarModulo();
    alert("Cuenta eliminada exitosamente (mock).");
}
else if (contraseña === ""){
    cerrarModulo();
    alert("Para eliminar la cuenta introduzca primero su contraseña.")
}
else {
    cerrarModulo();
    alert("Contraseña incorrecta. Intenta nuevamente.");
}
}

window.onload = cargarDatosPerfil;