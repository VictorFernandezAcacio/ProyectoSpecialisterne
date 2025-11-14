Reseña = {
    Fecha: "",
    Estrellas: 0,
    Comentario: "",
}

function Mostrar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'block';
}
function Quitar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'none';
}



function RESEÑAR() {
    Reseña.Fecha = document.getElementById("fehca_reseña").value
    Reseña.Estrellas = document.getElementById("estrellas_reseña").value
    Reseña.Comentario = document.getElementById("comentario_reseña").value


    console.log(Reseña)
}
