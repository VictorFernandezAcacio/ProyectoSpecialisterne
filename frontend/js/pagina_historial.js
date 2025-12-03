document.addEventListener("DOMContentLoaded", () => {
  // Eliminar viaje pendiente
  const botonesEliminar = document.querySelectorAll(".btn_eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", () => {
      const viaje = boton.closest(".card_viaje");
      if (viaje) {
        viaje.remove();
        alert("El viaje pendiente ha sido eliminado.");
      }
    });
  });

  // Anadir resena a viaje realizado
  const botonesResena = document.querySelectorAll(".btn_resena");
  botonesResena.forEach(boton => {
    boton.addEventListener("click", () => {
      const viaje = boton.closest(".card_viaje");
      const nombreViaje = viaje?.querySelector(".card_titulo")?.textContent || "este viaje";
      alert(`Anadir reseña para ${nombreViaje}`);
      // Aqui podrias abrir un modal para escribir la resena
    });
  });
});

