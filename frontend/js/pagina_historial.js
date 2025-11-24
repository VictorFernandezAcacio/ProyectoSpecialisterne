/* ============================
   DATOS DE VIAJES
============================ */

const Viaje_Japon = {
  nombre: "Al Sol Naciente...",
  imagen: "../Viaje_a_Japon.png",
  descripcion: "Algo sobre el viaje a Japón...",
  destinacion: "Tokyo, Kyoto, Osaka",
  fecha: "2025-06-15",
  precio: "5000€",
  resenas: [
    { fecha_resena: "02/02/2022", autor: "Alice", comentario: "Amazing trip!", estrellas: 5 },
    { fecha_resena: "01/01/2020", autor: "Bob", comentario: "Great experience", estrellas: 4 }
  ]
};

const Viaje_Antartida = {
  nombre: "Al Fin del Mundo",
  imagen: "../Polo_Sur.png",
  descripcion: "Algo sobre el viaje al Antartida...",
  destinacion: "Tierra de Fuego, Antartida",
  fecha: "2026-09-19",
  precio: "2400€",
  resenas: [
    { fecha_resena: "02/02/2022", autor: "Anna", comentario: "Amazing trip!", estrellas: 5 },
    { fecha_resena: "01/01/2020", autor: "Bobert", comentario: "Great experience", estrellas: 4 }
  ]
};

const Viaje_de_Test_III = {
  nombre: "Viaje de test III",
  imagen: "../.png",
  descripcion: "Algo sobre el viaje de test III...",
  destinacion: "Algun lugar en el país III",
  fecha: "2026-07-12",
  precio: "3300€",
  resenas: [
    { fecha_resena: "02/02/2022", autor: "Alicia", comentario: "Amazing trip!", estrellas: 5 },
    { fecha_resena: "01/01/2020", autor: "B.Bobrowski", comentario: "Great experience", estrellas: 4 }
  ]
};

const Viaje_de_Test_IV = {
  nombre: "Viaje de test IV",
  imagen: "../.png",
  descripcion: "Algo sobre el viaje de test IV...",
  destinacion: "Algun lugar en el país IV",
  fecha: "2026-07-12",
  precio: "3300€",
  resenas: [
    { fecha_resena: "02/02/2022", autor: "Alicianna", comentario: "Amazing trip!", estrellas: 5 },
    { fecha_resena: "01/01/2020", autor: "Bobriccio Bobrini", comentario: "Great experience", estrellas: 4 }
  ]
};


/* LISTAS DE VIAJES */
const Viajes_pendientes = [Viaje_Japon, Viaje_Antartida];
const Viajes_realizados = [Viaje_de_Test_III, Viaje_de_Test_IV];


/* ============================
   CARGA AUTOMÁTICA DE TARJETAS
============================ */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------
     SECCIÓN: Viajes Pendientes
  ------------------------------------ */
  const gridPendientes = document.querySelector("#viajes_pend + .grid_viajes");
  gridPendientes.innerHTML = "";

  Viajes_pendientes.forEach(viaje => {
    const card = document.createElement("article");
    card.classList.add("card_viaje");

    card.innerHTML = `
      <h3 class="card_titulo">${viaje.nombre}</h3>
      <img src="${viaje.imagen}" alt="${viaje.nombre}" class="card_img">
      <p class="card_meta">Destino: ${viaje.destinacion}</p>
      <p class="card_meta">Fecha: ${viaje.fecha}</p>
      <p class="card_meta">Precio: ${viaje.precio}</p>
      <button class="btn_eliminar" aria-label="Eliminar"></button>
    `;

    card.querySelector(".btn_eliminar").addEventListener("click", () => {
      card.remove();
      alert("El viaje pendiente ha sido eliminado.");
    });

    gridPendientes.appendChild(card);
  });



  /* -----------------------------------
     SECCIÓN: Viajes Realizados
  ------------------------------------ */

  // Select the second grid (the one under "Viajes realizados")
  const allGrids = document.querySelectorAll(".grid_viajes");
  const gridRealizados = allGrids[1]; 

  gridRealizados.innerHTML = "";

  Viajes_realizados.forEach(viaje => {
    const card = document.createElement("article");
    card.classList.add("card_viaje");

    card.innerHTML = `
      <h3 class="card_titulo">${viaje.nombre}</h3>
      <img src="${viaje.imagen}" alt="${viaje.nombre}" class="card_img">
      <p class="card_meta">Destino: ${viaje.destinacion}</p>
      <p class="card_meta">Fecha: ${viaje.fecha}</p>
      <p class="card_meta">Precio: ${viaje.precio}</p>
      <button class="btn_resena" aria-label="Reseña"></button>
    `;

    card.querySelector(".btn_resena").addEventListener("click", () => {
      alert("Aquí se mostrarán las reseñas de este viaje.");
    });

    gridRealizados.appendChild(card);
  });

});
