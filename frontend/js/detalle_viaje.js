import { auth } from "./firebaseConfig.js";

const API_BASE = "http://localhost:3000";

// -------------------- Cargar detalle del viaje --------------------
async function cargarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const idViaje = params.get("id");

  try {
    const res = await fetch(`${API_BASE}/viajes/${idViaje}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viaje = await res.json();

    // Imagen y descripción
    document.getElementById("imagen_viaje").src = `../img/${viaje.imagen || 'default.jpg'}`;
    document.getElementById("descripcion_viaje").textContent = viaje.descripcion || "";
    document.getElementById("titulo_viaje").textContent = viaje.nombre || viaje.destino;
    document.getElementById("precio_viaje").textContent = `${viaje.precio} €`;

    // Cargar reseñas
    cargarResenas(idViaje);
  } catch (error) {
    console.error("Error cargando detalle:", error);
    alert("No se pudo cargar la información del viaje.");
  }
}

// -------------------- Compra --------------------
function MostrarCompra() {
  document.getElementById("alerta_compra").style.display = "block";
}

function QuitarCompra() {
  document.getElementById("alerta_compra").style.display = "none";
}

async function ConfirmarCompra() {
  const params = new URLSearchParams(window.location.search);
  const idViaje = params.get("id");

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para comprar un viaje");
    return;
  }

  const usuario_id = user.uid;

  try {
    const res = await fetch(`${API_BASE}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viaje_id: idViaje, usuario_id })
    });

    if (res.ok) {
      alert("Reserva creada correctamente");
      QuitarCompra();
    } else {
      const errorMsg = await res.json();
      alert(errorMsg.error || "Error al realizar la reserva");
      QuitarCompra();
    }
  } catch (error) {
    console.error("Error en la reserva:", error);
    alert("Error inesperado al realizar la reserva.");
  }
}

// -------------------- Reseñas --------------------
async function cargarResenas(idViaje) {
  try {
    // CORREGIDO: ruta correcta según tu backend
    const res = await fetch(`${API_BASE}/viajes/${idViaje}/resenas`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const resenas = await res.json();

    const contenedor = document.getElementById("contenedor_resenas");
    contenedor.innerHTML = "";

    resenas
      .filter(r => r.id_usuario !== auth.currentUser?.uid) // campo correcto según tu tabla
      .forEach(r => {
        const div = document.createElement("div");
        div.className = "resena";
        div.innerHTML = `
          <div class="contenedor_datos_resena">
            <span>Usuario ${r.id_usuario}</span>
            <span>${r.valoracion} ★</span>
          </div>
          <div class="texto_resena">${r.resena_texto}</div>
        `;
        contenedor.appendChild(div);
      });
  } catch (error) {
    console.error("Error cargando reseñas:", error);
  }
}

// -------------------- Inicializar --------------------
document.addEventListener("DOMContentLoaded", cargarDetalle);

window.MostrarCompra = MostrarCompra;
window.QuitarCompra = QuitarCompra;
window.ConfirmarCompra = ConfirmarCompra;
