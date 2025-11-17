const Guardado = {
    Nombre: ["admin", "admin1"],
    Contraseña: ["12345678", "87654321"],
};

function Iniciar_Sesion() {
    limpiarErrores();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    let usuarioValido = false;
    let contrasenaValida = false;

    if (usuario.length === 0) {
        mostrarError("error_usuario", "ERROR: NO SE HA PUESTO EL USUARIO");
    } else if (usuario.length > 20) {
        mostrarError("error_usuario", "ERROR: EL USUARIO HA SOBREPASADO EL LÍMITE EXISTENTE");
    } else if (!Guardado.Nombre.includes(usuario)) {
        mostrarError("error_usuario", "ERROR: USUARIO INCORRECTO");
    } else {
        usuarioValido = true;
    }

    if (contrasena.length === 0) {
        mostrarError("error_contrasena", "ERROR: NO SE HA PUESTO LA CONTRASEÑA");
    } else if (contrasena.length < 8) {
        mostrarError("error_contrasena", "ERROR: CONTRASEÑA DEMASIADO CORTA");
    } else if (contrasena.length > 50) {
        mostrarError("error_contrasena", "ERROR: CONTRASEÑA DEMASIADO LARGA");
    } else {
        contrasenaValida = true;
    }

    if (usuarioValido && contrasenaValida) {
        const index = Guardado.Nombre.indexOf(usuario);
        if (Guardado.Contraseña[index] === contrasena) {
            console.log("Inicio de sesión correcto");
            window.location.href = "../html/Inicio.html";
        } else {
            mostrarError("error_contrasena", "ERROR: CONTRASEÑA NO COINCIDE CON EL USUARIO");
        }
    }
}

function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    document.getElementById("error_usuario").textContent = "";
    document.getElementById("error_contrasena").textContent = "";
}

document.getElementById("btn_iniciar").addEventListener("click", Iniciar_Sesion);
document.getElementById("btn_registro").addEventListener("click", function () {
    window.location.href = "../html/pagina_registro.html";
});
