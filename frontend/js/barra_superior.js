// Función para actualizar el contador
function actualizarContador() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contador_carrito");
  if (contador) contador.textContent = carrito.length;
}

// Inicializar contador al cargar
document.addEventListener("DOMContentLoaded", actualizarContador);
// Ejecutar también inmediatamente por si el script se carga al final del body
actualizarContador();

// Escuchar cambios en localStorage (sincroniza el contador entre páginas/pestañas)
window.addEventListener("storage", (event) => {
  if (event.key === "carrito") {
    actualizarContador();
  }
});

// Función para añadir viaje al carrito evitando duplicados
function addToCart(viaje) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.some(item => item.id === viaje.id)) {
    alert("Este viaje ya está en el carrito");
    return;
  }

  carrito.push(viaje);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarContador();
  alert("Viaje añadido al carrito 🛒");
}

// Abrir carrito.html y guardar página de origen
document.addEventListener("click", (e) => {
  if (e.target.closest("#btn_carrito")) {
    const currentPage = window.location.href;
    localStorage.setItem("pagina_origen", currentPage);
    window.location.href = "carrito.html";
  }
});

// Exponer funciones globales
window.addToCart = addToCart;
window.actualizarContador = actualizarContador;
