function abrirResena(id) {
  document.getElementById("ventana_resena").style.display = "block"
  idResena = id
}
function cerrarResena() {
  document.getElementById("ventana_resena").style.display = "none"
  resetear()
}

function resetear() {
  valueStar = 0
  stars.forEach(s => s.classList.remove('selected'));

  document.getElementById("comentario").value = "";
}

const stars = document.querySelectorAll('.rating span');

stars.forEach(star => {
  star.addEventListener('click', function() {
    const value = this.getAttribute('data-value');
    valueStar = value

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


function EnviarResena() {
  const variableComentario = document.getElementById("comentario").value
  if (variableComentario.length >= 1 && valueStar >= 1) {
    alert("FUNCIONA.")
    
  } else {
    alert("Debe rellenar las estrellas y el comentario.")
  }
}