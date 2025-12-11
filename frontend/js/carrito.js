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
  const lista = document.getElementById("lista_carrito");
  const formPago = document.getElementById("form_pago");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
          <p>Fecha inicio: ${formatearFecha(v.fecha_inicio || v.fechaInicio)}</p>
          <p>Fecha fin: ${formatearFecha(v.fecha_fin || v.fechaFin)}</p>
        </div>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </div>
    `).join("");

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

  function actualizarContador() {
    const contador = document.getElementById("contador_carrito");
    if (contador) contador.textContent = carrito.length;
  }

  // Finalizar compra
  if (formPago) {
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

      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const usuarioId = usuario ? usuario.id : null;
      if (!usuarioId) {
        alert("No se encontró usuario en sesión");
        return;
      }

      try {
        for (const v of carrito) {
          await fetch("http://localhost:3000/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario_id: usuarioId,
              viaje_id: v.id,
              estado: "confirmada"
            })
          });
        }

        alert(`Compra finalizada ✅\nGracias ${nombre}, recibirás la confirmación en ${email}`);

        carrito = [];
        localStorage.removeItem("carrito");
        renderCarrito();
        actualizarContador();
        formPago.reset();
      } catch (err) {
        console.error("Error creando reservas:", err);
        alert("Error al procesar la compra");
      }
    });
  }

  renderCarrito();
  actualizarContador();
});
