document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista_carrito");
  const formPago = document.getElementById("form_pago");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Renderizar viajes del carrito con estilo de historial
  function renderCarrito() {
    if (carrito.length === 0) {
      lista.innerHTML = "<p>El carrito está vacío.</p>";
      return;
    }

    lista.innerHTML = carrito.map((v, index) => `
      <article class="card_viaje">
        <h3 class="card_titulo">
          <!-- 🔗 El título es un enlace al detalle -->
          <a href="Viaje.html?id=${v.id}" class="link-detalle">${v.destino}</a>
        </h3>
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="card_img">
        <p class="card_meta">Precio: ${v.precio} €</p>
        <button class="btn-secundario btn_eliminar" data-index="${index}">Eliminar</button>
      </article>
    `).join("");

    // Botones eliminar
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

  // Actualizar contador en barra superior
  function actualizarContador() {
    const contador = document.getElementById("contador_carrito");
    if (contador) contador.textContent = carrito.length;
  }

  // Botón volver
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "⬅️ Volver";
  btnVolver.id = "btn_volver";
  document.body.insertBefore(btnVolver, lista);

  btnVolver.addEventListener("click", () => {
    const origen = localStorage.getItem("pagina_origen");
    window.location.href = origen || "Inicio.html";
  });

  // Finalizar compra
  formPago.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert("No hay viajes en el carrito");
      return;
    }

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const tarjeta = document.getElementById("tarjeta").value;

    if (!nombre || !email || !tarjeta) {
      alert("Por favor, rellena todos los campos");
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
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      }

      alert(`Compra finalizada ✅\nGracias ${nombre}, recibirás la confirmación en ${email}`);
      carrito = [];
      localStorage.removeItem("carrito");
      renderCarrito();
      actualizarContador();
      formPago.reset();

    } catch (err) {
      console.error("Error al crear reservas:", err);
      alert("No se pudo registrar la compra en el sistema. Inténtalo más tarde.");
    }
  });

  // Inicialización
  renderCarrito();
  actualizarContador();
});
