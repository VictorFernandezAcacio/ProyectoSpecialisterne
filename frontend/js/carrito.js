document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista_carrito");
  const formPago = document.getElementById("form_pago");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCarrito() {
    if (carrito.length === 0) {
      lista.innerHTML = "<p>El carrito está vacío.</p>";
      return;
    }

    lista.innerHTML = carrito.map((v, index) => {

      const estrellas = v.valoracion_media
        ? `<span class="estrellas">${Number(v.valoracion_media).toFixed(1)} ⭐</span>`
        : "Sin reseñas";

      const fechaInicio = v.fecha_inicio
        ? new Date(v.fecha_inicio).toLocaleDateString("es-ES")
        : "No disponible";

      const fechaFin = v.fecha_fin
        ? new Date(v.fecha_fin).toLocaleDateString("es-ES")
        : "No disponible";

      // 🔥 PRECIO SEGURO
      const precioFinal = v.precio_final ?? v.precio;
      const precioOriginal = v.precio_original ?? null;

      const precioHTML = precioOriginal && precioOriginal !== precioFinal
        ? `
          <p class="card_meta">
            <span class="precio-original">${precioOriginal} €</span>
            <span class="precio-final">${precioFinal} €</span>
          </p>
        `
        : `
          <p class="card_meta">
            <span class="precio-final">${precioFinal} €</span>
          </p>
        `;

      return `
        <article class="card_viaje">
          <h3 class="card_titulo">
            <a href="Viaje.html?id=${v.id}" class="link-detalle">${v.destino}</a>
          </h3>

          <img src="../img/${v.imagen || 'default.jpg'}" 
               alt="${v.destino}" 
               class="card_img">

          <p class="card_meta"><strong>Origen:</strong> ${v.origen || "No disponible"}</p>
          <p class="card_meta"><strong>Fecha inicio:</strong> ${fechaInicio}</p>
          <p class="card_meta"><strong>Fecha fin:</strong> ${fechaFin}</p>

          ${precioHTML}

          <p class="card_meta"><strong>Valoración:</strong> ${estrellas}</p>

          <button class="btn-secundario btn_eliminar" data-index="${index}">
            Eliminar
          </button>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".btn_eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        carrito.splice(idx, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
        actualizarContador();
      });
    });
  }

  function actualizarContador() {
    const contador = document.getElementById("contador_carrito");
    if (contador) contador.textContent = carrito.length;
  }

  // Finalizar compra
  formPago.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert("No hay viajes en el carrito");
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const token = usuario?.token;

      for (const v of carrito) {
        const res = await fetch("http://localhost:3000/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ viaje_id: v.id })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }

      alert("Compra finalizada ✅");
      carrito = [];
      localStorage.removeItem("carrito");
      renderCarrito();
      actualizarContador();
      formPago.reset();

    } catch (err) {
      console.error("Error al crear reservas:", err);
      alert("Error al finalizar la compra");
    }
  });

  renderCarrito();
  actualizarContador();
});
