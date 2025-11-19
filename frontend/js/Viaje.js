// -------------------- Datos de viajes --------------------
const viajes = {
  1: {
    titulo: "Viaje 1",
    estrellas: "⭐⭐⭐⭐⭐",
    precio: "500€",
    descripcion: "Incluye transporte, alojamiento y visitas guiadas.",
    imagen: "../img/viaje1.jpg"
  },
  2: {
    titulo: "Viaje 2",
    estrellas: "⭐⭐⭐⭐",
    precio: "650€",
    descripcion: "Vuelo y hotel 4 estrellas.",
    imagen: "../img/viaje2.jpg"
  },
  3: {
    titulo: "Viaje 3",
    estrellas: "⭐⭐⭐⭐⭐",
    precio: "700€",
    descripcion: "Paquete completo con actividades.",
    imagen: "../img/viaje3.jpg"
  },
  4: {
    titulo: "Viaje 4",
    estrellas: "⭐⭐⭐",
    precio: "450€",
    descripcion: "Escapada económica con alojamiento básico.",
    imagen: "../img/viaje4.jpg"
  },
  5: {
    titulo: "Viaje 5",
    estrellas: "⭐⭐⭐⭐",
    precio: "800€",
    descripcion: "Viaje de lujo con todo incluido.",
    imagen: "../img/viaje5.jpg"
  }
  // Añade más viajes aquí si lo necesitas
};

// -------------------- Cargar datos dinámicos --------------------
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const viaje = viajes[id];

  if (viaje) {
    document.getElementById("titulo_banner").textContent = viaje.titulo;
    document.getElementById("imagen_viaje").src = viaje.imagen;
    document.getElementById("titulo_viaje").textContent = viaje.titulo;
    document.getElementById("estrellas_viaje").textContent = viaje.estrellas;
    document.getElementById("precio_viaje").textContent = viaje.precio;
    document.getElementById("descripcion_viaje").textContent = viaje.descripcion;
  } else {
    document.getElementById("toda_informacion").innerHTML = "<p>Viaje no encontrado</p>";
  }
});

// -------------------- Ventana reseñas --------------------
const Resena = { Fecha: "", Estrellas: 0, Comentario: "" };

function MostrarVentanaResena() {
  document.getElementById('alerta_resena').style.display = 'block';
}
function QuitarVentanaResena() {
  document.getElementById('alerta_resena').style.display = 'none';
}
function Resenar() {
  Resena.Fecha = document.getElementById("fecha_resena").value;
  Resena.Estrellas = document.getElementById("estrellas_resena").value;
  Resena.Comentario = document.getElementById("comentario_resena").value;

  if (Resena.Fecha === "" || Resena.Estrellas == 0 || Resena.Comentario === "") {
    alert("Por favor, completa todos los campos antes de enviar la reseña.");
    return;
  }

  const contenedor = document.getElementById("contenedor_resenas");
  const nueva = document.createElement("div");
  nueva.classList.add("resena");
  nueva.innerHTML = `
    <div class="contenedor_datos_resena">
      <span class="usuario_viaje">Usuario</span>
      <span class="fecha_resena">${Resena.Fecha}</span>
      <span class="estrellas_viaje">${"⭐".repeat(Resena.Estrellas)}</span>
    </div>
    <span class="texto_resena">${Resena.Comentario}</span>
  `;
  contenedor.appendChild(nueva);

  QuitarVentanaResena();
  document.getElementById("fecha_resena").value = "";
  document.getElementById("estrellas_resena").value = 0;
  document.getElementById("comentario_resena").value = "";
}

// -------------------- Ventana compra --------------------
function MostrarCompra() {
  document.getElementById('alerta_compra').style.display = 'block';
}
function QuitarCompra() {
  document.getElementById('alerta_compra').style.display = 'none';
}
function ConfirmarCompra() {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const tarjeta = document.getElementById("tarjeta").value;

  if (nombre === "" || email === "" || tarjeta === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  alert("Compra realizada con éxito. Gracias por confiar en Bug Travel.");
  QuitarCompra();

  // Limpiar campos
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("tarjeta").value = "";
}
