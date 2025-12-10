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
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="carrito-img">
        <div class="carrito-info">
          <h3>${v.destino}</h3>
          <p>Precio: ${v.precio} €</p>
        </div>
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
  formPago.addEventListener("submit", (e) => {
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

    // Guardar viajes pagados en reservas
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas = reservas.concat(carrito);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert(`Compra finalizada ✅\nGracias ${nombre}, recibirás la confirmación en ${email}`);

    carrito = [];
    localStorage.removeItem("carrito");
    renderCarrito();
    actualizarContador();
    formPago.reset();
  });

  // Inicialización
  renderCarrito();
  actualizarContador();
});
