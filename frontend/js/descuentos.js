async function cargarBannerDescuentos() {
  try {
    const res = await fetch('/api/descuentos'); // tu endpoint en backend
    const descuentos = await res.json();
    const lista = document.getElementById('lista_descuentos');
    lista.innerHTML = '';

    if (descuentos.length === 0) {
      lista.innerHTML = '<p>No hay descuentos activos en este momento.</p>';
      return;
    }

    descuentos.forEach(d => {
      const item = document.createElement('div');
      item.className = 'banner-item';
      item.innerHTML = `
        <strong>${d.titulo}</strong><br>
        ${d.descripcion}<br>
        <span>${d.porcentaje}% OFF</span>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error('Error cargando descuentos:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarBannerDescuentos);
