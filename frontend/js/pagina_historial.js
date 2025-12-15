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
      <h3 class="card_titulo">
        <!-- 🔗 El título es un enlace al detalle del viaje -->
        <a href="Viaje.html?id=${v.viaje_id}" class="link-detalle">${v.destino}</a>
      </h3>
      <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="card_img">
      <p class="card_meta">Fecha inicio: ${formatearFecha(v.fecha_inicio)}</p>
      <p class="card_meta">Fecha fin: ${formatearFecha(v.fecha_fin)}</p>
      <p class="card_meta">Precio: ${v.precio} €</p>
      ${
        fechaFin && fechaFin < hoy
          ? `<button class="btn-secundario btn_resena">Reseña</button>`
          : `<button class="btn-secundario btn_eliminar">Cancelar reserva</button>`
      }
    `;

    if (fechaFin && fechaFin < hoy) {
      listaRealizados.appendChild(article);
      const btnResena = article.querySelector(".btn_resena");
      btnResena.addEventListener("click", () => {
        abrirResena(v.viaje_id)
        alert(`Añadir reseña para ${v.destino}`);
      });
    } else {
      listaPendientes.appendChild(article);
      const btnEliminar = article.querySelector(".btn_eliminar");
      btnEliminar.addEventListener("click", async () => {
        try {
          const res = await fetch(`http://localhost:3000/reservas/${v.id}`, { method: "DELETE" });
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
