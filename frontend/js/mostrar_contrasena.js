function mostrar_contrasena() {
  switch (document.getElementById("contrasena").type) {
    case ("password"):
      document.getElementById("contrasena").type = "text"
      break;
    case ("text"):
      document.getElementById("contrasena").type = "password"
      break;
  }
}