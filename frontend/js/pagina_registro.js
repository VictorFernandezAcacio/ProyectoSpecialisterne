array_de_usuarios = []



function registrarse(){
    usuario_actual = {
    username: document.getElementById("usuario").value,
    correo: document.getElementById("correo").value,
    contrasenya: document.getElementById("contrasenya").value,
    conf_contrasenya: document.getElementById("confirmar_contrasenya").value,
    fecha_nacimiento: document.getElementById("fecha_de_nacimiento").value
};

if (document.getElementById("usuario").value === "" ||
    document.getElementById("correo").value === "" ||
    document.getElementById("contrasenya").value === "" ||
    document.getElementById("confirmar_contrasenya").value === "") {
        document.getElementById("mensaje_ de_error").style.display = "block";
        document.getElementById("mensaje_ de_error").innerHTML = "Por favor, complete todos los campos"
        console.log("Por favor, complete todos los campos")
}
else if (!usuario_actual.correo.includes("@") && !usuario_actual.correo.includes(".")){
    document.getElementById("mensaje_ de_error").style.display = "block";
    document.getElementById("mensaje_ de_error").innerHTML = "El correo no parece válido..."
    console.log("El correo no parece válido...")
}
else if (document.getElementById("contrasenya").value.length < 8) {
    document.getElementById("mensaje_ de_error").style.display = "block";
    document.getElementById("mensaje_ de_error").innerHTML = "La contraseña es demasiado corta!"    
    console.log("La contraseña es demasiado corta!")
}
else if (usuario_actual.contrasenya !== usuario_actual.conf_contrasenya) {
    document.getElementById("mensaje_ de_error").style.display = "block";
    document.getElementById("mensaje_ de_error").innerHTML = "Las contraseñas no coinciden!"
    console.log("Las contraseñas no coinciden!");
}
else if (usuario_actual.fecha_nacimiento <= "1909-04-21" || usuario_actual.fecha_nacimiento >= "2025-11-14") {
    document.getElementById("mensaje_ de_error").style.display = "block";
    document.getElementById("mensaje_ de_error").innerHTML = "Por favor, introduzca su fecha de nacimiento real."
    console.log("Por favor, introduzca su fecha de nacimiento real.")
}
else {
    console.log("La información de usuario está guardada!")
    array_de_usuarios.push(usuario_actual)
}
    console.log(usuario_actual)
    console.log(array_de_usuarios)
}

