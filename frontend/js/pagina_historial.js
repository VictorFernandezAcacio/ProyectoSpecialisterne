// Función auxiliar para formatear fecha en DD/MM/AAAA
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Renderizar reservas
function renderReservas(reservas) {
  const listaPendientes = document.getElementById("viajes_pendientes");
  const listaRealizados = document.getElementById("viajes_realizados");

  if (!reservas || reservas.length === 0) {
    listaPendientes.innerHTML = "<p>No tienes viajes pendientes.</p>";
    listaRealizados.innerHTML = "<p>No tienes viajes realizados todavía.</p>";
    return;
  }

  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  reservas.forEach(v => {
    const fechaFin = v.fecha_fin ? new Date(v.fecha_fin) : null;
    if (fechaFin) fechaFin.setHours(0,0,0,0);

    const article = document.createElement("article");
    article.classList.add("card_viaje");
    article.innerHTML = `
      <h3 class="card_titulo">${v.destino}</h3>
      <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="card_img">
      <p class="card_meta">Fecha inicio: ${formatearFecha(v.fecha_inicio)}</p>
      <p class="card_meta">Fecha fin: ${formatearFecha(v.fecha_fin)}</p>
      <p class="card_meta">Precio: ${v.precio} €</p>
      <button class="${fechaFin && fechaFin < hoy ? 'btn_resena' : 'btn_eliminar'}"
              aria-label="${fechaFin && fechaFin < hoy ? 'Reseña' : 'Eliminar'}"></button>
    `;

    if (fechaFin && fechaFin < hoy) {
      listaRealizados.appendChild(article);
      const btnResena = article.querySelector(".btn_resena");
      btnResena.addEventListener("click", () => {
        alert(`Añadir reseña para ${v.destino}`);
      });
    } else {
      listaPendientes.appendChild(article);
      const btnEliminar = article.querySelector(".btn_eliminar");
      btnEliminar.addEventListener("click", () => {
        alert("Funcionalidad de cancelar/eliminar reserva pendiente.");
      });
    }
  });
}

// Cargar reservas desde backend
async function cargarReservas() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario ? usuario.id : null;
    if (!usuarioId) {
      console.error("No se encontró usuario_id en sesión/localStorage");
      return;
    }

    const res = await fetch(`http://localhost:3000/reservas/usuario/${usuarioId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const reservas = await res.json();
    renderReservas(reservas);
  } catch (err) {
    console.error("Error cargando reservas:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarReservas);
