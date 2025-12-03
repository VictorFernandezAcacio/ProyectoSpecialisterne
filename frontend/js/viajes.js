import { auth } from "./firebaseConfig.js";

const API_BASE = "http://localhost:3000";

// -------------------- Cargar viajes --------------------
async function cargarViajes() {
  try {
    const res = await fetch(`${API_BASE}/viajes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viajes = await res.json();
    const contenedor = document.getElementById("lista_viajes");
    contenedor.innerHTML = "";

    if (!Array.isArray(viajes) || viajes.length === 0) {
      contenedor.innerHTML = "<p>No hay viajes disponibles en este momento.</p>";
      return;
    }

    viajes.forEach(v => {
      const fechaInicio = new Date(v.fecha_inicio).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const fechaFin = new Date(v.fecha_fin).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      let descuentoHTML = "";
      if (v.porcentaje && Number(v.porcentaje) > 0 && v.precio_final < v.precio) {
        descuentoHTML = `<span class="descuento">${v.porcentaje}% OFF → ${v.precio_final} €</span><br>`;
      }

      const card = document.createElement("div");
      card.className = "viaje-card";
      card.innerHTML = `
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="viaje-img">
        <h3>${v.destino}</h3>
        <p>${v.descripcion || ''}</p>
        <span>Fecha: ${fechaInicio} - ${fechaFin}</span><br>
        <span class="precio">Precio original: ${v.precio} €</span><br>
        ${descuentoHTML}
        <button class="btn-reservar" onclick="verDetalle(${v.id})">Ver detalle</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando viajes:", error);
  }
}

// -------------------- Redirigir al detalle --------------------
function verDetalle(idViaje) {
  window.location.href = `Viaje.html?id=${idViaje}`;
}

// Exponer función al scope global para onclick
window.verDetalle = verDetalle;

// Inicializar
document.addEventListener("DOMContentLoaded", cargarViajes);