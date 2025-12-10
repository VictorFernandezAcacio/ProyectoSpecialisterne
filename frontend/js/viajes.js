// Variable global para usuario
let usuario = null;

// Función auxiliar para formatear fecha en DD/MM/AAAA
function formatearFecha(fechaISO) {
  if (!fechaISO) return "No disponible";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para cargar viajes desde el backend
async function cargarViajes() {
  try {
    const res = await fetch('http://localhost:3000/viajes');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viajes = await res.json();

    console.log("Viajes recibidos del backend:", viajes);

    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '';

    if (!viajes || viajes.length === 0) {
      contenedor.innerHTML = '<p>No hay viajes disponibles en este momento.</p>';
      return;
    }

    viajes.forEach(v => {
      const card = document.createElement('div');
      card.className = 'viaje-card';

      // ✅ Mostrar precio con descuento solo si precio_final no es null
      const tieneDescuento = v.precio_final !== null;

      const precioHTML = tieneDescuento
        ? `<span class="precio tachado">Precio: ${v.precio} €</span>
           <span class="descuento">Precio con descuento: ${v.precio_final} €</span>`
        : `<span class="precio">Precio: ${v.precio} €</span>`;

      // ✅ Mostrar fechas formateadas
      const fechaInicio = formatearFecha(v.fecha_inicio);
      const fechaFin = formatearFecha(v.fecha_fin);

      card.innerHTML = `
        <img src="../img/${v.imagen || 'default.jpg'}" alt="${v.destino}" class="viaje-img">
        <h3>${v.destino}</h3>
        <p class="viaje-origen">Salida desde: ${v.origen}</p>
        <p>${v.descripcion || ''}</p>
        <p class="viaje-fecha">Fecha inicio: ${fechaInicio}</p>
        <p class="viaje-fecha">Fecha fin: ${fechaFin}</p>
        ${precioHTML}
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

document.addEventListener('DOMContentLoaded', () => {
  usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.tipo_usuario === 'administrador') {
    document.getElementById('admin_viajes').style.display = 'block';
  }
  cargarViajes();
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
    alert('Error al guardar el viaje');
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
        alert("Error al eliminar el viaje");
      }
    }
  };
}

// Exponer funciones al ámbito global
window.verDetalle = verDetalle;
window.cargarViajes = cargarViajes;
window.editarViaje = editarViaje;
