// Variable global para usuario
let usuario = null;

// Función auxiliar para formatear fecha en DD/MM/AAAA
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const soloFecha = fechaISO.split("T")[0];
  const [year, month, day] = soloFecha.split("-");
  return `${day}/${month}/${year}`;
}

// Función para cargar viajes desde el backend con filtros
async function cargarViajes() {
  try {
    // Capturar filtros si existen en inicio
    const origen = document.getElementById('origen')?.value || '';
    const destino = document.getElementById('destino')?.value || '';
    const fechaInicio = document.getElementById('fecha_inicio')?.value || '';
    const fechaFin = document.getElementById('fecha_fin')?.value || '';
    const precioMin = document.getElementById('precio_min')?.value || '';
    const precioMax = document.getElementById('precio_max')?.value || '';
    const ordenar = document.getElementById('ordenar')?.value || '';

    const params = new URLSearchParams({
      origen,
      destino,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      precio_min: precioMin,
      precio_max: precioMax,
      ordenar
    });

    const res = await fetch(`http://localhost:3000/viajes?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viajes = await res.json();

    console.log("Viajes recibidos del backend:", viajes);

    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '';

    if (!viajes || viajes.length === 0) {
      contenedor.innerHTML = '<p>No hay viajes disponibles con esos filtros.</p>';
      return;
    }

    viajes.forEach(v => {
      const card = document.createElement('div');
      card.className = 'viaje-card';

      // Precio con descuento
      const tieneDescuento = v.precio_final !== null && v.precio_final !== v.precio;
      const precioHTML = tieneDescuento
        ? `<span class="precio tachado">Precio: ${v.precio} €</span>
           <span class="descuento">Precio con descuento: ${v.precio_final} €</span>`
        : `<span class="precio">Precio: ${v.precio} €</span>`;

      // Fechas formateadas
      const fechaInicioFmt = formatearFecha(v.fecha_inicio);
      const fechaFinFmt = formatearFecha(v.fecha_fin);

      // Puntuación media
      let puntuacionHTML = '';
      if (v.valoracion_media && Number(v.valoracion_media) > 0) {
        puntuacionHTML = `
      <p class="viaje-rating">
        Puntuación media: ${Number(v.valoracion_media).toFixed(1)} ⭐
      </p>
      `;
      } else {
        puntuacionHTML = `<p class="viaje-rating">No hay reseñas disponibles.</p>`;
    }


      // Alarmas de proximidad y plazas
      const hoy = new Date();
      hoy.setHours(0,0,0,0);

      const soloFecha = v.fecha_inicio.split("T")[0];
      const [year, month, day] = soloFecha.split("-");
      const inicio = new Date(Number(year), Number(month) - 1, Number(day));
      inicio.setHours(0,0,0,0);

      const diffDias = Math.round((inicio.getTime() - hoy.getTime()) / (1000*60*60*24));
      const plazas = parseInt(v.plazas_disponibles, 10);

      const pocasPlazas = Number.isFinite(plazas) && plazas <= 5;
      const pocosDias = Number.isFinite(diffDias) && diffDias >= 0 && diffDias <= 7;

      let avisoHTML = "";
      if (pocosDias || pocasPlazas) {
        const partes = [];
        if (pocosDias) partes.push(`⚠️ El viaje empieza en ${diffDias} día${diffDias === 1 ? "" : "s"}.`);
        if (pocasPlazas) partes.push(`⚠️ Solo quedan ${plazas} plaza${plazas === 1 ? "" : "s"}.`);
        avisoHTML = `<div class="alerta">${partes.join("<br>")}</div>`;
      }

      card.innerHTML = `
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="viaje-img">
        <h3>${v.destino}</h3>
        <p class="viaje-origen">Salida desde: ${v.origen}</p>
        <p>${v.descripcion || ''}</p>
        <p class="viaje-fecha">Fecha inicio: ${fechaInicioFmt}</p>
        <p class="viaje-fecha">Fecha fin: ${fechaFinFmt}</p>
        ${precioHTML}
        ${puntuacionHTML}
        ${avisoHTML}
        <button class="btn-reservar">Ver detalle</button>
      `;

      const btnDetalle = card.querySelector('.btn-reservar');
      btnDetalle.addEventListener('click', () => verDetalle(v.id));

      if (usuario?.tipo_usuario === 'administrador') {
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarViaje(v));
        card.appendChild(btnEditar);
      }

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando viajes:', error);
    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '<p>Error al cargar los viajes. Inténtalo más tarde.</p>';
  }
}

// Redirigir al detalle del viaje
function verDetalle(idViaje) {
  window.location.href = `Viaje.html?id=${idViaje}`;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.tipo_usuario === 'administrador') {
    document.getElementById('admin_viajes').style.display = 'block';
  }

  // Cargar viajes al inicio
  cargarViajes();

  // Activar buscador solo si existe en inicio
  const btnBuscar = document.getElementById('buscar');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      cargarViajes();
    });
  }
});

// Guardar viaje (crear o actualizar)
document.getElementById('form_viaje')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idViaje = document.getElementById('id_viaje').value;
  const viajeData = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    fecha_inicio: document.getElementById('fecha_inicio').value,
    fecha_fin: document.getElementById('fecha_fin').value,
    origen: document.getElementById('origen').value,
    destino: document.getElementById('destino').value,
    precio: document.getElementById('precio').value,
    plazas_disponibles: document.getElementById('plazas_disponibles').value,
    descuento: document.getElementById('descuento').value || 0,
    id_transporte: document.getElementById('id_transporte').value,
    imagen: document.getElementById('imagen').value
  };

  console.log("Datos enviados al backend:", viajeData);

  const token = usuario?.token;
  const url = idViaje
    ? `http://localhost:3000/viajes/${idViaje}`
    : 'http://localhost:3000/viajes';
  const method = idViaje ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(viajeData)
  });

  if (res.ok) {
    alert(idViaje ? 'Viaje actualizado con éxito' : 'Viaje creado con éxito');
    cargarViajes();
    e.target.reset();
    document.getElementById('id_viaje').value = '';
    document.getElementById('form_title').textContent = "Crear viaje";
    document.getElementById('btn_guardar').textContent = "Crear viaje";
    document.getElementById('btn_eliminar').style.display = 'none';
  } else {
    const error = await res.json();
    console.error("Error backend:", error);
    alert(`❌ Error al guardar el viaje: ${error.error}`);
  }
});

// Función para preparar edición
function editarViaje(viaje) {
  document.getElementById('id_viaje').value = viaje.id || '';
  document.getElementById('nombre').value = viaje.nombre || '';
  document.getElementById('descripcion').value = viaje.descripcion || '';
  document.getElementById('fecha_inicio').value = viaje.fecha_inicio ? viaje.fecha_inicio.split('T')[0] : '';
  document.getElementById('fecha_fin').value = viaje.fecha_fin ? viaje.fecha_fin.split('T')[0] : '';
  document.getElementById('origen').value = viaje.origen || '';
  document.getElementById('destino').value = viaje.destino || '';
  document.getElementById('precio').value = viaje.precio || '';
  document.getElementById('plazas_disponibles').value = viaje.plazas_disponibles || '';
  document.getElementById('descuento').value = viaje.descuento || 0;
  document.getElementById('id_transporte').value = viaje.id_transporte || '';
  document.getElementById('imagen').value = viaje.imagen || '';

  document.getElementById('form_title').textContent = "Editar viaje";
  document.getElementById('btn_guardar').textContent = "Actualizar viaje";

  const btnEliminar = document.getElementById('btn_eliminar');
  btnEliminar.style.display = 'inline-block';
  btnEliminar.onclick = async () => {
    if (confirm("¿Seguro que quieres eliminar este viaje?")) {
      const token = usuario?.token;
      const res = await fetch(`http://localhost:3000/viajes/${viaje.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Viaje eliminado con éxito");
        cargarViajes();
        document.getElementById('form_viaje').reset();
        document.getElementById('id_viaje').value = '';
        document.getElementById('form_title').textContent = "Crear viaje";
        document.getElementById('btn_guardar').textContent = "Crear viaje";
        btnEliminar.style.display = 'none';
      } else {
        const error = await res.json();
        console.error("Error backend:", error);
        alert(`❌ Error al eliminar el viaje: ${error.error}`);
      }
    }
  };
}

// Exponer funciones al ámbito global
window.verDetalle = verDetalle;
window.cargarViajes = cargarViajes;
window.editarViaje = editarViaje;

