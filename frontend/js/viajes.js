// Función para cargar viajes desde el backend
async function cargarViajes() {
  try {
    const res = await fetch('http://localhost:3000/viajes');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viajes = await res.json();

    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '';

    if (!viajes || viajes.length === 0) {
      contenedor.innerHTML = '<p>No hay viajes disponibles en este momento.</p>';
      return;
    }

    viajes.forEach(v => {
      const card = document.createElement('div');
      card.className = 'viaje-card';

      const precioHTML = v.precio_final && v.precio_final !== v.precio
        ? `<span class="precio">Precio original: ${v.precio} €</span>
           <span class="descuento">Precio con descuento: ${v.precio_final} €</span>`
        : `<span class="precio">Precio: ${v.precio} €</span>`;

      card.innerHTML = `
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="viaje-img">
        <h3>${v.destino}</h3>
        <p class="viaje-origen">Salida desde: ${v.origen}</p>
        <p>${v.descripcion || ''}</p>
        ${precioHTML}
        <button class="btn-reservar" onclick="verDetalle(${v.id})">Ver detalle</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando viajes:', error);
    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '<p>Error al cargar los viajes. Inténtalo más tarde.</p>';
  }
}

// Redirigir al detalle del viaje
function verDetalle(idViaje) {
  window.location.href = `Viaje.html?id=${idViaje}`;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', cargarViajes);

// Exponer funciones al ámbito global
window.verDetalle = verDetalle;
window.cargarViajes = cargarViajes;
