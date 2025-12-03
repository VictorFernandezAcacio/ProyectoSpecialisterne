const API_BASE = "http://localhost:3000";

// -------------------- Cargar descuentos activos --------------------
async function cargarBannerDescuentos() {
  try {
    const res = await fetch(`${API_BASE}/descuentos/activos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const descuentos = await res.json();
    const lista = document.getElementById("lista_descuentos");
    lista.innerHTML = "";

    if (!Array.isArray(descuentos) || descuentos.length === 0) {
      lista.innerHTML = "<p>No hay descuentos activos en este momento.</p>";
      return;
    }

    descuentos.forEach(d => {
      // Limitar porcentaje máximo al 99%
      const porcentajeValido = Math.min(d.porcentaje, 99);

      // Formatear fechas de inicio y fin
      const fechaInicio = new Date(d.fecha_inicio).toLocaleDateString('es-ES');
      const fechaFin = new Date(d.fecha_fin).toLocaleDateString('es-ES');

      const item = document.createElement("div");
      item.className = "banner-item";
      item.innerHTML = `
        <strong>${d.titulo}</strong><br>
        ${d.descripcion}<br>
        <span>${porcentajeValido}% OFF</span><br>
        <span>Válido: ${fechaInicio} - ${fechaFin}</span>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Error cargando descuentos:", error);
  }
}

// -------------------- Inicializar --------------------
document.addEventListener("DOMContentLoaded", cargarBannerDescuentos);
