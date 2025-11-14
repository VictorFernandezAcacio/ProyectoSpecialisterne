Guardado = {
    Nombre: ["admin", "admin1"],
    Contraseña: ["12345678", "87654321"],
}

function Iniciar_Sesión() {
    ERRORES()
    INICIO()
}
function ERRORES() {
    ERROR_usuario()
    ERROR_contraseña()
}

function ERROR_usuario() {
    if (document.getElementById("usuario").value.length === 0) {
        document.getElementById("error_usuario").textContent = "ERROR: NO SE A PUESTO EL USUARIO"
    } else if (document.getElementById("usuario").value > 20) {
        document.getElementById("error_usuario").textContent = "ERROR: EL USUARIO A SOBREPASADO EL LIMITE EXISTENTE"
    }
    for (let i = 0; i <= Guardado.Nombre.length-1; i++) {
        if (document.getElementById("usuario").value !== Guardado.Nombre[i]) {
            document.getElementById("error_usuario").textContent = "ERROR: NO SE A ESCRITO BIEN EL USUARIO"
        }
    }
}
function ERROR_contraseña() {
    if (document.getElementById("contraseña").value.length === 0) {
        document.getElementById("error_contraseña").textContent = "ERROR: NO SE A PUESTO LA CONTRASEÑA"
    } else if (document.getElementById("contraseña").value.length < 8) {
        document.getElementById("error_contraseña").textContent = "ERROR: NO SE A ESCRITO BIEN LA CONTRASEÑA"
    } else if (document.getElementById("contraseña").value < 50) {
        document.getElementById("error_contraseña").textContent = "ERROR: LA CONTRASEÑA A SOBREPASADO EL LIMITE EXISTENTE"
    }
    for (let i = 0; i <= Guardado.Nombre.length-1; i++) {
        if (document.getElementById("contraseña").value !== Guardado.Contraseña[i]) {
            document.getElementById("error_contraseña").textContent = "ERROR: NO SE A PUESTO LA CONTRASEÑA"
        }
    }
}

function INICIO() {
    for (let i = 0; i <= Guardado.Nombre.length-1; i++) {
        if (document.getElementById("usuario").value === Guardado.Nombre[i] && document.getElementById("contraseña").value === Guardado.Contraseña[i]) {
            console.log("FUNCIONA")
            i = Guardado.Nombre.length-1
        } else {
            console.log("USUARIO NO EXISTENTE")
        }
    }
}