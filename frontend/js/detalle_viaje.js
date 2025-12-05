// Configuración base de la API
const BASE_URL = 'http://localhost:3000';

// Obtener parámetro id de la URL
function getIdViaje() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Renderizar detalle del viaje en los elementos del HTML
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

  // Reseñas
  const contResenas = document.getElementById('contenedor_resenas');
  if (contResenas) {
    const reseñasHTML =
      viaje.reseñas && viaje.reseñas.length > 0
        ? viaje.reseñas
            .map(
              (r) =>
                `<p>⭐ ${r.puntuacion} - ${r.comentario} <br><em>${r.usuario_nombre || ''}</em></p>`
            )
            .join('')
        : '<p>No hay reseñas disponibles.</p>';
    contResenas.innerHTML = reseñasHTML;
  }
}

// Cargar datos del viaje desde el backend
export async function cargarDetalle() {
  const idViaje = getIdViaje();
  if (!idViaje) {
    console.error('ID de viaje no proporcionado en la URL');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/viajes/${idViaje}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viaje = await res.json();
    renderDetalle(viaje);
  } catch (error) {
    console.error('Error cargando detalle:', error);
    const desc = document.getElementById('descripcion_viaje');
    if (desc) desc.textContent = 'Error al cargar el viaje.';
  }
}

// Reservar viaje
export async function reservarViaje(idViaje) {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuario_id = usuario?.id;

    if (!usuario_id) {
      alert('Debes iniciar sesión para reservar.');
      return;
    }

    const res = await fetch(`${BASE_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, viaje_id: idViaje })
    });

    if (res.ok) {
      // Redirigir a Viaje.html tras reservar
      window.location.href = `Viaje.html?id=${idViaje}`;
    } else {
      let errorMsg;
      try {
        const data = await res.json();
        errorMsg = data.error || 'Error al realizar la reserva';
      } catch {
        const text = await res.text();
        errorMsg = text || 'Error al realizar la reserva';
      }
      alert(errorMsg);
    }
  } catch (error) {
    console.error('Error en la reserva:', error);
    alert('Error inesperado al realizar la reserva.');
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', cargarDetalle);

// Exponer funciones al ámbito global (para botones en HTML)
window.reservarViaje = reservarViaje;
