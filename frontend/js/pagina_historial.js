// ===============================
// Formatear fecha DD/MM/AAAA
// ===============================
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Viaje que se está reseñando
window.viajeResenaActual = null;

// ===============================
// Renderizar reservas
// ===============================
function renderReservas(reservas) {
  const listaPendientes = document.getElementById("viajes_pendientes");
  const listaRealizados = document.getElementById("viajes_realizados");

  listaPendientes.innerHTML = "";
  listaRealizados.innerHTML = "";

  if (!reservas || reservas.length === 0) {
    listaPendientes.innerHTML = "<p>No tienes viajes pendientes.</p>";
    listaRealizados.innerHTML = "<p>No tienes viajes realizados todavía.</p>";
    return;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  reservas.forEach(v => {
    const fechaFin = v.fecha_fin ? new Date(v.fecha_fin) : null;
    if (fechaFin) fechaFin.setHours(0, 0, 0, 0);

    // ===============================
    // Precio (con o sin descuento)
    // ===============================
    let precioHTML = "";

    if (v.porcentaje) {
      precioHTML = `
        <p class="card_meta">
          <span class="precio-original">${v.precio_original} €</span>
          <span class="precio-final">${v.precio_final} €</span>
        </p>
      `;
    } else {
      precioHTML = `
        <p class="card_meta">
          <span class="precio-final">${v.precio_final} €</span>
        </p>
      `;
    }

    // ===============================
    // Valoración
    // ===============================
    const estrellasHTML = v.valoracion_media
      ? `<p class="card_meta">Valoración: ${Number(v.valoracion_media).toFixed(1)} ⭐</p>`
      : `<p class="card_meta">Valoración: Sin reseñas</p>`;

    // ===============================
    // Card
    // ===============================
    const article = document.createElement("article");
    article.classList.add("card_viaje");

    article.innerHTML = `
      <h3 class="card_titulo">
        <a href="Viaje.html?id=${v.viaje_id}" class="link-detalle">
          ${v.viaje_nombre || v.destino}
        </a>
      </h3>

      <img src="../img/${v.imagen || 'default.jpg'}"
           alt="${v.destino}"
           class="card_img">

      <p class="card_meta"><strong>Origen:</strong> ${v.origen}</p>
      <p class="card_meta"><strong>Destino:</strong> ${v.destino}</p>
      <p class="card_meta"><strong>Fecha inicio:</strong> ${formatearFecha(v.fecha_inicio)}</p>
      <p class="card_meta"><strong>Fecha fin:</strong> ${formatearFecha(v.fecha_fin)}</p>

      ${precioHTML}
      ${estrellasHTML}

      ${
        fechaFin && fechaFin < hoy
          ? `<button class="btn-secundario btn_resena">Reseñar</button>`
          : `<button class="btn-secundario btn_eliminar">Cancelar reserva</button>`
      }
    `;

    // ===============================
    // Viaje realizado → reseña
    // ===============================
    if (fechaFin && fechaFin < hoy) {
      listaRealizados.appendChild(article);

      const btnResena = article.querySelector(".btn_resena");
      btnResena.addEventListener("click", () => {
        window.viajeResenaActual = v;
        abrirResena();
      });
    } 
    // ===============================
    // Viaje pendiente → cancelar
    // ===============================
    else {
      listaPendientes.appendChild(article);

      const btnEliminar = article.querySelector(".btn_eliminar");
      btnEliminar.addEventListener("click", async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/reservas/${v.id}`,
            { method: "DELETE" }
          );

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          article.remove();
          alert(`Reserva a ${v.destino} cancelada correctamente ✅`);
        } catch (err) {
          console.error("Error al cancelar reserva:", err);
          alert("No se pudo cancelar la reserva. Inténtalo más tarde.");
        }
      });
    }
  });
}

// ===============================
// Cargar reservas
// ===============================
async function cargarReservas() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    if (!usuarioId) {
      console.error("No se encontró usuario en localStorage");
      return;
    }

    const res = await fetch(
      `http://localhost:3000/reservas/usuario/${usuarioId}`
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const reservas = await res.json();
    renderReservas(reservas);
  } catch (err) {
    console.error("Error cargando reservas:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarReservas);
