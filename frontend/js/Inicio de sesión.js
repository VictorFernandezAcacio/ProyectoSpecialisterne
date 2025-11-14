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
    for (let i = 0; i <= Guardado.Nombre.length-1; i++) {
        if (document.getElementById("usuario").value !== Guardado.Nombre[i]) {
            document.getElementById("error_usuario").textContent = "NO SE A ESCRITO BIEN EL USUARIO"
        } else if (document.getElementById("usuario").value === Guardado.Nombre[i]) {
            document.getElementById("error_usuario").textContent = ""
            return
        }
    }
    if (document.getElementById("usuario").value.length === 0) {
        document.getElementById("error_usuario").textContent = "NO SE A PUESTO EL USUARIO"
    } else if (document.getElementById("usuario").value > 20) {
        document.getElementById("error_usuario").textContent = "EL USUARIO A SOBREPASADO EL LIMITE EXISTENTE"
    }
}
function ERROR_contraseña() {
    if (document.getElementById("contraseña").value.length === 0) {
        document.getElementById("error_contraseña").textContent = "NO SE A PUESTO LA CONTRASEÑA"
    } else if (document.getElementById("contraseña").value.length < 8) {
        document.getElementById("error_contraseña").textContent = "NO SE A ESCRITO BIEN LA CONTRASEÑA"
    } else if (document.getElementById("contraseña").value < 50) {
        document.getElementById("error_contraseña").textContent = "LA CONTRASEÑA A SOBREPASADO EL LIMITE EXISTENTE"
    } else {
        document.getElementById("error_contraseña").textContent = ""
    }
}

function INICIO() {
    for (let i = 0; i <= Guardado.Nombre.length-1; i++) {
        if (document.getElementById("usuario").value === Guardado.Nombre[i] && document.getElementById("contraseña").value === Guardado.Contraseña[i]) {
            console.log("FUNCIONA")
            i = Guardado.Nombre.length-1
        }
    }
}


a = 0
function mostrar_ocultar() {
    if (a === 0) {
        document.getElementById("contraseña").type = "text"
        document.getElementById("btn_mostrar_ocultar").textContent = "👁️"
        a = 1
    } else {
        document.getElementById("contraseña").type = "password"
        document.getElementById("btn_mostrar_ocultar").textContent = "👁️‍🗨️"
        a = 0
    }
}

