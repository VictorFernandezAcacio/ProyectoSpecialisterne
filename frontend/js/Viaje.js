
// Hardcoaded ejemplos de viajes:

const Viaje_Japon = {
  nombre: "Al Sol Naciente...",
  imagen: scr="../Viaje_a_Japon.png",
  descripcion:"Algo sobre el viaje a Japón...Algo sobre el viaje a Japón...Algo sobre el viaje a Japón...Algo sobre el viaje a Japón...",
  destinacion: "Tokyo, Kyoto, Osaka",
  fecha: "2025-06-15",
  precio: "5000€",
  resenyas: [
    {
      fecha_resenya: "02/02/2022",
      autor: "Alice",
      comentario: "Amazing trip! Loved the temples and food.",
      estrellas: 5
    },
    {
      fecha_resenya: "01/01/2020",
      autor: "Bob",
      comentario: "Great experience, but a bit crowded.",
      estrellas: 4
    }
  ],
  rating: 4.5
};
const Viaje_Tierra_del_Fuego = {
  nombre: "Al Fin del Mundo",
  imagen: scr="../Tierra_del_Fuego.png",
  descripcion:"Algo sobre el viaje a la TF...Algo sobre el viaje a la TF...Algo sobre el viaje a la TF...Algo sobre el viaje a la TF...",
  destinacion: "Well, Idk, some places in Argentina...",
  fecha: "2026-09-19",
  precio: "2400€",
  resenya: [
    {
      fecha_resenya: "02/02/2022",
      autor: "Alice",
      comentario: "Amazing trip! Loved the temples and food.",
      estrellas: 5
    },
    {
      fecha_resenya: "01/01/2020",
      autor: "Bob",
      comentario: "Great experience, but a bit crowded.",
      estrellas: 4
    }
  ],
  rating: 4.5
};

function Mostrar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'block';
}

function Quitar_Ventana_Reseña() {
    document.getElementById('alerta_reseña').style.display = 'none';
}

function RESEÑAR() {
  resenya = {
      fecha_resenya: "",
      autor: "",
      comentario: "",
      estrellas: ""
    }
    resenya.fecha_resenya = document.getElementById("fecha_reseña").value;
    resenya.comentario = document.getElementById("comentario_reseña").value
    resenya.estrellas = document.getElementById("estrellas_reseña").value
  Viaje_Japon.resenyas.push(resenya)
  console.log(Viaje_Japon.resenyas)
  Renovar_resenyas()
  Quitar_Ventana_Reseña()
}

// Funciones para la ventana de pago
function abrirCardModal() {
  document.getElementById("overlay").style.display = "flex";
}
function cerrarCardModal() {
  document.getElementById("overlay").style.display = "none";
}
function submitCard() {
  alert("Card data submitted (demo only — not real processing).");
  cerrarCardModal();
}

window.document.getElementById("titulo_pagina").innerHTML = Viaje_Japon.nombre
window.document.getElementById("titulo_viaje").innerHTML = Viaje_Japon.nombre
window.document.getElementById("precio_viaje").innerHTML = Viaje_Japon.precio
window.document.getElementById("imagen_viaje").src = Viaje_Japon.imagen
window.document.getElementById("descripción_viaje").innerHTML = Viaje_Japon.descripcion

function Renovar_resenyas () {
  htmlpa = "";
  for (i = 0; i < Viaje_Japon.resenyas.length; i++) {
    var estrellas = "";
    for (ii = 0; ii < Viaje_Japon.resenyas[i].estrellas; ii++) {
      estrellas += "⭐"
    }
    htmlpa += "<div class='reseña'>" +
    "<div class='contenedor_datos_reseña'>" + 
    "<span class='usuario_viaje' id='usuario_1'>" + Viaje_Japon.resenyas[i].autor + "</span>" +
    "<span id='fecha_1'>" + Viaje_Japon.resenyas[i].fecha_resenya + "</span>" +
    "<span class='estrellas_viaje' id='estrellas_1'>" + estrellas + "</span>" +
    "</div><span class='texto_reseña'>" + Viaje_Japon.resenyas[i].comentario + "</span></div>";
  }
  document.getElementById("contenedor_reseñas").innerHTML = htmlpa;
}

window.Renovar_resenyas()

