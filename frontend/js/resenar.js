function abrirResena() {
    document.getElementById("ventana_resena").style.display = "block"
}
function cerrarResena() {
    document.getElementById("ventana_resena").style.display = "none"
}

const stars = document.querySelectorAll('.rating span');

stars.forEach(star => {
  star.addEventListener('click', function() {
    const value = this.getAttribute('data-value');

    // Limpiar selección anterior
    stars.forEach(s => s.classList.remove('selected'));

    // Marcar las necesarias
    stars.forEach(s => {
      if (s.getAttribute('data-value') <= value) {
        s.classList.add('selected');
      }
    });

  });

  // Efecto hover opcional
  star.addEventListener('mouseover', function() {
    const value = this.getAttribute('data-value');

    stars.forEach(s => s.classList.remove('hover'));
    stars.forEach(s => {
      if (s.getAttribute('data-value') <= value) {
        s.classList.add('hover');
      }
    });
  });

  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.remove('hover'));
  });
});
