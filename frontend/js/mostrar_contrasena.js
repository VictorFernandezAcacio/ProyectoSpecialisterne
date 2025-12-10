function mostrar_contrasena(value) {
  switch (document.getElementById(value).type) {
    case ("password"):
      document.getElementById(value).type = "text"
      break;
    case ("text"):
      document.getElementById(value).type = "password"
      break;
  }
}