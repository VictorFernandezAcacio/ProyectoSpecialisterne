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

function renderDetalle(viaje) {
  const img = document.getElementById('imagen_viaje');
  if (img) img.src = `../img/${viaje.imagen || 'default.jpg'}`;

  const titulo = document.getElementById('titulo_viaje');
  if (titulo) titulo.textContent = viaje.destino;

  // ✅ ORIGEN
  const origen = document.getElementById('origen_viaje');
  if (origen) {
    origen.textContent = `Origen: ${viaje.origen || 'No disponible'}`;
  }

  const desc = document.getElementById('descripcion_viaje');
  if (desc) desc.textContent = viaje.descripcion || '';

  const precio = document.getElementById('precio_viaje');
  if (precio) {
    if (viaje.precio_final && viaje.precio_final !== viaje.precio) {
      precio.innerHTML = `
        <span class="precio-original">${viaje.precio} €</span>
        <span class="precio-descuento">${viaje.precio_final} €</span>
      `;
    } else {
      precio.textContent = `Precio: ${viaje.precio} €`;
    }
  }

  const fecha = document.getElementById('fecha_viaje');
  if (fecha) {
    const inicio = formatearFecha(viaje.fecha_inicio);
    const fin = formatearFecha(viaje.fecha_fin);
    fecha.textContent =
      viaje.fecha_inicio || viaje.fecha_fin
        ? `Del ${inicio} al ${fin}`
        : 'Fechas no disponibles';
  }

  const rating = document.getElementById('valoracion_media');
  if (rating) {
    if (viaje.valoracion_media && Number(viaje.valoracion_media) > 0) {
      rating.textContent = `Puntuación media: ${Number(viaje.valoracion_media).toFixed(1)} ⭐`;
    } else {
      rating.textContent = 'No hay reseñas disponibles.';
    }
  }
}

// Renderizar reseñas
function renderResenas(resenas) {
  const contResenas = document.getElementById('contenedor_resenas');
  if (!contResenas) return;

  contResenas.innerHTML =
    resenas.length > 0
      ? resenas.map(
          (r) => `
            <div class="resena">
              <div class="contenedor_datos_resena">
                <span>⭐ ${r.valoracion}</span>
                <span>Usuario: ${r.nombre_usuario || r.id_usuario}</span>
              </div>
              <p class="texto_resena">${r.resena_texto}</p>
            </div>`
        ).join('')
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
    const resViaje = await fetch(`${BASE_URL}/viajes/${idViaje}`);
    if (!resViaje.ok) throw new Error(`HTTP ${resViaje.status}`);
    const viaje = await resViaje.json();
    viajeActual = viaje;
    renderDetalle(viaje);

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
  const destino = viajeActual.destino;
  const precio = viajeActual.precio_final || viajeActual.precio;
  const imagen = viajeActual.imagen || "default.jpg";

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (!carrito.some(v => v.id === idViaje)) {
    carrito.push({
  id: idViaje,
  destino: viajeActual.destino,
  origen: viajeActual.origen || "No disponible",
  imagen: viajeActual.imagen || "default.jpg",

  fecha_inicio: viajeActual.fecha_inicio,
  fecha_fin: viajeActual.fecha_fin,
  precio: viajeActual.precio_final || viajeActual.precio,
  precio_original: viajeActual.precio,
  valoracion_media: viajeActual.valoracion_media
});


    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Viaje añadido al carrito 🛒");
  } else {
    alert("Este viaje ya está en el carrito");
  }

  const contador = document.getElementById("contador_carrito");
  if (contador) contador.textContent = carrito.length;
};

// Confirmar compra (ejemplo simple)
window.ConfirmarCompra = function() {
  alert("Compra confirmada ✅");
  document.getElementById("alerta_compra").style.display = "none";
};

// Cancelar compra
window.QuitarCompra = function() {
  document.getElementById("alerta_compra").style.display = "none";
};

// Inicialización
document.addEventListener('DOMContentLoaded', cargarDetalle);
