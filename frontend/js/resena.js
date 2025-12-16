let valoracionSeleccionada = 0;

function abrirResena() {
  const ventana = document.getElementById("ventana_resena");
  if (ventana) ventana.style.display = "flex";
}

function cerrarResena() {
  const ventana = document.getElementById("ventana_resena");
  if (ventana) ventana.style.display = "none";
  valoracionSeleccionada = 0;
  limpiarEstrellas();
  const comentario = document.getElementById("comentario");
  if (comentario) comentario.value = "";
}

function seleccionarEstrella(valor) {
  valoracionSeleccionada = valor;
  const estrellas = document.querySelectorAll(".rating span");
  estrellas.forEach((estrella) => {
    const val = parseInt(estrella.dataset.value, 10);
    estrella.classList.toggle("active", val <= valor);
  });
}

function limpiarEstrellas() {
  document.querySelectorAll(".rating span").forEach((estrella) => {
    estrella.classList.remove("active");
  });
}

async function EnviarResena() {
  const comentarioEl = document.getElementById("comentario");
  const comentario = comentarioEl ? comentarioEl.value.trim() : "";

  if (valoracionSeleccionada === 0) {
    alert("Por favor, selecciona una puntuación en estrellas.");
    return;
  }
  if (!comentario) {
    alert("Por favor, escribe un comentario.");
    return;
  }

  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario ? usuario.id : null;
    const viaje = window.viajeResenaActual;

    if (!viaje || !viaje.viaje_id) {
      alert("No se ha seleccionado ningún viaje para reseñar.");
      return;
    }
    if (!usuarioId) {
      alert("No se ha encontrado el usuario en sesión.");
      return;
    }

    const url = `http://localhost:3000/resenas/viaje/${viaje.viaje_id}`;
    const payload = {
      valoracion: valoracionSeleccionada,
      resena_texto: comentario,
      id_usuario: usuarioId
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    alert("Reseña enviada correctamente ✅");
    cerrarResena();

    document.dispatchEvent(new CustomEvent("resena-enviada", {
      detail: { viajeId: viaje.viaje_id }
    }));

  } catch (err) {
    console.error("Error al enviar reseña:", err);
    alert("No se pudo enviar la reseña ❌");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const estrellas = document.querySelectorAll(".rating span");
  estrellas.forEach((estrella) => {
    estrella.addEventListener("click", () => {
      const valor = parseInt(estrella.dataset.value, 10);
      seleccionarEstrella(valor);
    });
  });

  const modal = document.getElementById("ventana_resena");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarResena();
    });
  }
});

window.abrirResena = abrirResena;
window.cerrarResena = cerrarResena;
window.EnviarResena = EnviarResena;
