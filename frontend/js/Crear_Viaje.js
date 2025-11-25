const viajes = [];

const form = document.getElementById("travelForm");
const resultBox = document.getElementById("resultBox");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const viaje = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    fecha_inicio: document.getElementById("fecha_inicio").value,
    fecha_fin: document.getElementById("fecha_fin").value,
    origen: document.getElementById("origen").value,
    destinacion: document.getElementById("destinacion").value,
    precio: Number(document.getElementById("precio").value),
    plazas_disponibles: Number(document.getElementById("plazas_disponibles").value),
    descuento: Number(document.getElementById("descuento").value),
    transporte_id: Number(document.getElementById("transporte_id").value)
  };

  viajes.push(viaje);
  console.log(viajes);

  resultBox.style.display = "block";
  resultBox.textContent = JSON.stringify(viaje, null, 2);
});