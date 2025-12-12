// Función para actualizar el contador del carrito
function actualizarContador() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contador_carrito");
  if (contador) contador.textContent = carrito.length;
}

// Inicializar contador al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
});

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

// 👉 Abrir carrito.html y guardar página de origen
document.addEventListener("click", (e) => {
  if (e.target.closest("#btn_carrito")) {
    const currentPage = window.location.href;
    localStorage.setItem("pagina_origen", currentPage);
    window.location.href = "carrito.html";
  }
});

// 👉 MutationObserver para enganchar el botón de perfil cuando aparezca
const observer = new MutationObserver(() => {
  const btnPerfil = document.getElementById("btn_Perfil");
  if (btnPerfil && !btnPerfil.dataset.listenerAdded) {
    btnPerfil.addEventListener("click", () => {
      window.location.href = "Perfil.html";
    });
    btnPerfil.dataset.listenerAdded = "true"; // marca para no duplicar
  }
});

// Observa todo el body por cambios en hijos
observer.observe(document.body, { childList: true, subtree: true });

// Exponer funciones globales
window.addToCart = addToCart;
window.actualizarContador = actualizarContador;
