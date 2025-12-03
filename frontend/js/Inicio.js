// Función para cargar viajes desde el backend
async function cargarViajes() {
  try {
    const res = await fetch('/api/viajes'); // endpoint que devuelve viajes desde tu BBDD
    const viajes = await res.json();
    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '';

    if (viajes.length === 0) {
      contenedor.innerHTML = '<p>No hay viajes disponibles en este momento.</p>';
      return;
    }

    viajes.forEach(v => {
      const card = document.createElement('div');
      card.className = 'viaje-card';
      card.innerHTML = `
        <img src="${v.imagen}" alt="${v.destino}" class="viaje-img">
        <h3>${v.destino}</h3>
        <p>${v.descripcion}</p>
        <span class="precio">Precio: ${v.precio} €</span>
        <button class="btn-reservar" onclick="reservarViaje(${v.id})">Reservar</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando viajes:', error);
  }
}

// Función para reservar un viaje
async function reservarViaje(idViaje) {
  try {
    const res = await fetch(`/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viaje_id: idViaje })
    });

    if (res.ok) {
      alert('Reserva realizada con éxito');
    } else {
      alert('Error al realizar la reserva');
    }
  } catch (error) {
    console.error('Error en la reserva:', error);
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', cargarViajes);
