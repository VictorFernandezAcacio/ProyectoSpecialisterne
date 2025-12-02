export async function obtenerResenas(id_usuario) {
  const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}/resenas`);
  if (!res.ok) throw new Error("Error al obtener reseñas");
  return await res.json();
}

export async function obtenerViajes(id_usuario) {
  const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}/viajes`);
  if (!res.ok) throw new Error("Error al obtener viajes");
  return await res.json();
}
