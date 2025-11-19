// Objeto reseña
const Reseña = {
    Fecha: "",
    Estrellas: 0,
    Comentario: "",
};

// Mostrar ventana de reseña
function Mostrar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'block';
}

// Ocultar ventana de reseña
function Quitar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'none';
}

// Guardar reseña
function RESEÑAR() {
    Reseña.Fecha = document.getElementById("fecha_reseña").value;
    Reseña.Estrellas = document.getElementById("estrellas_reseña").value;
    Reseña.Comentario = document.getElementById("comentario_reseña").value;

    if (Reseña.Fecha === "" || Reseña.Estrellas === 0 || Reseña.Comentario === "") {
        alert("Por favor, completa todos los campos antes de enviar la reseña.");
        return;
    }

    console.log("Nueva reseña registrada:", Reseña);

    // Aquí podrías añadir la reseña al contenedor en la página
    const contenedor = document.getElementById("contenedor_reseñas");
    const nuevaReseña = document.createElement("div");
    nuevaReseña.classList.add("reseña");

    nuevaReseña.innerHTML = `
        <div class="contenedor_datos_reseña">
            <span class="usuario_viaje">Usuario</span>
            <span class="fecha_reseña">${Reseña.Fecha}</span>
            <span class="estrellas_viaje">${"⭐".repeat(Reseña.Estrellas)}</span>
        </div>
        <span class="texto_reseña">${Reseña.Comentario}</span>
    `;

    contenedor.appendChild(nuevaReseña);

    // Cerrar ventana y limpiar campos
    Quitar_Ventana_Reseña();
    document.getElementById("fecha_reseña").value = "";
    document.getElementById("estrellas_reseña").value = 0;
    document.getElementById("comentario_reseña").value = "";
}

// Poner las estrellas amarillas y el valor
function marcarEstrellas(valor) {
    Reseña.Estrellas = valor;
    
    for (let i = 1; i <= 5; i++) {
        document.getElementById("estrella_" + i).style.color =
        i <= Reseña.Estrellas ? "yellow" : "black";
    }
}
