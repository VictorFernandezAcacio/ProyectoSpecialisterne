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

// 👉 Acción del carrito (redirige a carrito.html porque sí existe)
document.addEventListener("click", (e) => {
  if (e.target.closest("#btn_carrito")) {
    const currentPage = window.location.href;
    localStorage.setItem("pagina_origen", currentPage);
    window.location.href = "carrito.html";
  }
});

// 👉 Acción del perfil (aún no existe Perfil.html, mostramos aviso temporal)
const observer = new MutationObserver(() => {
  const btnPerfil = document.getElementById("btn_Perfil");
  if (btnPerfil && !btnPerfil.dataset.listenerAdded) {
    btnPerfil.addEventListener("click", () => {
      // Cuando tengas Perfil.html, cambia esto:
      window.location.href = "Perfil.html";
    });
    btnPerfil.dataset.listenerAdded = "true"; // marca para no duplicar
  }
});

// Observa todo el body por cambios en hijos
observer.observe(document.body, { childList: true, subtree: true });

// Actualizar fecha y hora en vivo
function actualizarFechaHora() {
  const ahora = new Date();
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  document.getElementById("fecha_actual").textContent = fecha;
  document.getElementById("hora_actual").textContent = hora;
}
setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// Obtener tiempo actual en Barcelona
async function cargarTiempo() {
  try {
    const res = await fetch("https://wttr.in/Barcelona?format=%t+%C"); 
    const texto = await res.text();
    document.getElementById("tiempo_actual").textContent = texto;
  } catch (error) {
    document.getElementById("tiempo_actual").textContent = "Tiempo no disponible";
  }
}
cargarTiempo();


// Exponer funciones globales
window.addToCart = addToCart;
window.actualizarContador = actualizarContador;
