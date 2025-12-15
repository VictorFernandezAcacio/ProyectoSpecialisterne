// Configuración base de la API
const BASE_URL = 'http://localhost:3000';

// Función auxiliar para formatear fecha en DD/MM/AAAA
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Obtener parámetro id de la URL
function getIdViaje() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Variable global para guardar el viaje actual
let viajeActual = null;

// Renderizar detalle del viaje
function renderDetalle(viaje) {
  // Imagen
  const img = document.getElementById('imagen_viaje');
  if (img) img.src = `../img/${viaje.imagen || 'default.jpg'}`;

  // Título
  const titulo = document.getElementById('titulo_viaje');
  if (titulo) titulo.textContent = viaje.destino;

  // Descripción
  const desc = document.getElementById('descripcion_viaje');
  if (desc) desc.textContent = viaje.descripcion || '';

  // Precio
  const precio = document.getElementById('precio_viaje');
  if (precio) {
    precio.textContent =
      viaje.precio_final && viaje.precio_final !== viaje.precio
        ? `Precio original: ${viaje.precio} € | Precio con descuento: ${viaje.precio_final} €`
        : `Precio: ${viaje.precio} €`;
  }

  // Fechas
  const fecha = document.getElementById('fecha_viaje');
  if (fecha) {
    const inicio = formatearFecha(viaje.fecha_inicio);
    const fin = formatearFecha(viaje.fecha_fin);
    fecha.textContent =
      viaje.fecha_inicio || viaje.fecha_fin
        ? `Del ${inicio} al ${fin}`
        : 'Fechas no disponibles';
  }
}

// Renderizar reseñas
function renderResenas(resenas) {
  const contResenas = document.getElementById('contenedor_resenas');
  if (!contResenas) return;

  contResenas.innerHTML =
    resenas.length > 0
      ? resenas
          .map(
            (r) =>
              `<p>⭐ ${r.valoracion} - ${r.resena_texto} <br><em>Usuario: ${r.nombre_usuario}</em></p>`
          )
          .join('')
      : '<p>No hay reseñas disponibles.</p>';
}

// Cargar datos del viaje y sus reseñas
export async function cargarDetalle() {
  const idViaje = getIdViaje();
  if (!idViaje) {
    console.error('ID de viaje no proporcionado en la URL');
    return;
  }

  try {
    // Viaje
    const resViaje = await fetch(`${BASE_URL}/viajes/${idViaje}`);
    if (!resViaje.ok) throw new Error(`HTTP ${resViaje.status}`);
    const viaje = await resViaje.json();
    viajeActual = viaje; // guardamos el viaje para usarlo en AñadirCarrito
    renderDetalle(viaje);

    // Reseñas
    const resResenas = await fetch(`${BASE_URL}/viajes/${idViaje}/resenas`);
    if (resResenas.ok) {
      const resenas = await resResenas.json();
      renderResenas(resenas);
    }
  } catch (error) {
    console.error('Error cargando detalle:', error);
    const desc = document.getElementById('descripcion_viaje');
    if (desc) desc.textContent = 'Error al cargar el viaje.';
  }
}

// Añadir viaje al carrito
window.AñadirCarrito = function() {
  if (!viajeActual) {
    alert("No se pudo cargar el viaje");
    return;
  }

  const idViaje = getIdViaje();
  const destino = document.getElementById("titulo_viaje").textContent;
  const precioTexto = document.getElementById("precio_viaje").textContent;
  const precio = precioTexto.match(/\d+/g) ? precioTexto.match(/\d+/g)[0] : "";
  const imagen = document.getElementById("imagen_viaje").getAttribute("src").split("/").pop();

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (!carrito.some(v => v.id === idViaje)) {
    carrito.push({
      id: idViaje,
      destino,
      precio,
      imagen,
      fecha_inicio: viajeActual.fecha_inicio,
      fecha_fin: viajeActual.fecha_fin
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Viaje añadido al carrito 🛒");
  } else {
    alert("Este viaje ya está en el carrito");
  }

  const contador = document.getElementById("contador_carrito");
  if (contador) contador.textContent = carrito.length;
};

// Inicialización
document.addEventListener('DOMContentLoaded', cargarDetalle);
