document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista_carrito");
  const formPago = document.getElementById("form_pago");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Renderizar viajes del carrito
  function renderCarrito() {
    if (carrito.length === 0) {
      lista.innerHTML = "<p>El carrito está vacío.</p>";
      return;
    }

    lista.innerHTML = carrito.map((v, index) => `
      <div class="carrito-item">
        <a href="Viaje.html?id=${v.id}">
          <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="carrito-img">
          <div class="carrito-info">
            <h3>${v.destino}</h3>
            <p>Precio: ${v.precio} €</p>
          </div>
        </a>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </div>
    `).join("");

    // Botones eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
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

  // Botón volver a la página de origen
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "⬅️ Volver";
  btnVolver.id = "btn_volver";
  document.body.insertBefore(btnVolver, lista);

  btnVolver.addEventListener("click", () => {
    const origen = localStorage.getItem("pagina_origen");
    if (origen) {
      window.location.href = origen;
    } else {
      window.location.href = "Inicio.html"; // fallback
    }
  });

  // Finalizar compra con formulario
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
      // Obtener token del usuario logueado
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const token = usuario?.token; // asegúrate de guardar el idToken en loginUsuario

      // Enviar cada viaje del carrito al backend
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
