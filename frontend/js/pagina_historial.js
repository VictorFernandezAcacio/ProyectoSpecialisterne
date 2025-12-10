// Función auxiliar para formatear fecha en DD/MM/AAAA
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const listaPendientes = document.getElementById("viajes_pendientes");
  const listaRealizados = document.getElementById("viajes_realizados");

  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  if (reservas.length === 0) {
    listaPendientes.innerHTML = "<p>No tienes viajes pendientes.</p>";
    listaRealizados.innerHTML = "<p>No tienes viajes realizados todavía.</p>";
    return;
  }

  const hoy = new Date();
  hoy.setHours(0,0,0,0); // normalizar a medianoche

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
      <button class="${fechaFin && fechaFin < hoy ? 'btn_resena' : 'btn_eliminar'}" aria-label="${fechaFin && fechaFin < hoy ? 'Reseña' : 'Eliminar'}"></button>
    `;

    if (fechaFin && fechaFin < hoy) {
      // Ya realizado
      listaRealizados.appendChild(article);
      const btnResena = article.querySelector(".btn_resena");
      btnResena.addEventListener("click", () => {
        alert(`Añadir reseña para ${v.destino}`);
      });
    } else {
      // Pendiente
      listaPendientes.appendChild(article);
      const btnEliminar = article.querySelector(".btn_eliminar");
      btnEliminar.addEventListener("click", () => {
        reservas = reservas.filter(r => r.id !== v.id);
        localStorage.setItem("reservas", JSON.stringify(reservas));
        article.remove();
        alert("El viaje pendiente ha sido eliminado.");
      });
    }
  });
});
