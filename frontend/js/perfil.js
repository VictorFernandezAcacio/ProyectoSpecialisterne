const mockUser = {
    correo: "usuario@example.com",
    usuario: "JuanPerez",
    contraseña: "123456",
    cumpleaños: "1995-08-15"
};


function cargarDatosPerfil() {
    document.getElementById("correo").value = mockUser.correo;
    document.getElementById("usuario").value = mockUser.usuario;
    document.getElementById("can_contraseña").value = "";
    document.getElementById("con_contraseña").value = "";
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
    const nueva = document.getElementById("can_contraseña").value;
    const confirmar = document.getElementById("con_contraseña").value;

    if (nueva === "" || confirmar === "") {
        alert("Debes rellenar ambos campos.");
        return;
    }

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    mockUser.contraseña = nueva;
    alert("Contraseña cambiada exitosamente (mock).");
}


function Mostrar_Ventana_Borrar() {
    document.getElementById("alerta_borrar").style.display = "block";
}


function Quitar_Ventana_Borrar() {
    document.getElementById("alerta_borrar").style.display = "none";
}


function BorrarCuenta() {
    const inputPassword = document.getElementById("borrar_cuenta").value;

    if (inputPassword === mockUser.contraseña) {
        alert("Cuenta borrada exitosamente (mock).");
        Quitar_Ventana_Borrar();
    } else {
        alert("Contraseña incorrecta. Intenta nuevamente.");
    }
}

window.onload = cargarDatosPerfil;
