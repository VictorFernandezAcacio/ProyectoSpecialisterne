import { getCurrentUserToken } from "./firebaseConfig.js";

// Umbrales configurables para avisos
const UMBRAL_DIAS = 7;       // mostrar aviso si faltan <= 7 días
const UMBRAL_PLAZAS = 5;     // mostrar aviso si quedan <= 5 plazas

// 🔑 Helper para llamadas al backend con token actualizado
async function fetchWithAuth(url, options = {}) {
  let token = await getCurrentUserToken();
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    token = await getCurrentUserToken(true); // fuerza renovación
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    });
  }

  return res;
}

// Parseo seguro de fechas ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
function parseFechaSinHora(str) {
  if (!str) return null;
  const soloFecha = str.split("T")[0]; // cortar solo la parte de fecha
  const [year, month, day] = soloFecha.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function hoySinHora() {
  const h = new Date();
  h.setHours(0, 0, 0, 0);
  return h;
}

function diffDias(inicio, fin) {
  if (!inicio || !fin) return null;
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((fin.getTime() - inicio.getTime()) / msPorDia);
}

function validarFechasReserva(fechaInicioStr, fechaFinStr) {
  const hoy = hoySinHora();
  const inicio = parseFechaSinHora(fechaInicioStr);
  const fin = parseFechaSinHora(fechaFinStr);

  if (!inicio || !fin) {
    alert("❌ Fechas inválidas o ausentes.");
    return false;
  }
  if (inicio < hoy) {
    alert("❌ No puedes reservar un viaje con una fecha de inicio pasada.");
    return false;
  }
  if (fin < hoy) {
    alert("❌ No puedes reservar un viaje con una fecha de fin pasada.");
    return false;
  }
  if (inicio >= fin) {
    alert("❌ La fecha de inicio debe ser anterior a la fecha de fin.");
    return false;
  }
  return true;
}

// Cargar viajes
async function cargarViajes() {
  try {
    const res = await fetchWithAuth('/api/viajes');
    const viajes = await res.json();

    if (!res.ok) {
      alert(`❌ Error al cargar viajes: ${viajes.error}${viajes.detalle ? " - " + viajes.detalle : ""}`);
      return;
    }

    console.log("Viajes recibidos:", viajes); // 🔎 Depuración

    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '';

    if (!Array.isArray(viajes) || viajes.length === 0) {
      contenedor.innerHTML = '<p>No hay viajes disponibles en este momento.</p>';
      return;
    }

    viajes.forEach(v => {
      const card = document.createElement('div');
      card.className = 'viaje-card';

      const hoy = hoySinHora();
      const inicio = parseFechaSinHora(v.fecha_inicio);
      const diasRestantes = inicio ? diffDias(hoy, inicio) : null;

      const plazas = parseInt(v.plazas_disponibles, 10);
      const pocasPlazas = Number.isFinite(plazas) && plazas <= UMBRAL_PLAZAS;
      const pocosDias = Number.isFinite(diasRestantes) && diasRestantes >= 0 && diasRestantes <= UMBRAL_DIAS;

      // 🔎 Depuración detallada
      console.log("Viaje:", v.nombre, "fecha_inicio:", v.fecha_inicio, "→ días restantes:", diasRestantes, "pocosDias:", pocosDias, "plazas:", plazas, "pocasPlazas:", pocasPlazas);

      let avisoHTML = "";
      if (pocosDias || pocasPlazas) {
        const partes = [];
        if (pocosDias) partes.push(`⚠️ El viaje empieza en ${diasRestantes} día${diasRestantes === 1 ? "" : "s"}.`);
        if (pocasPlazas) partes.push(`⚠️ Solo quedan ${plazas} plaza${plazas === 1 ? "" : "s"}.`);
        avisoHTML = `<div class="alerta">${partes.join("<br>")}</div>`;
      }

      const precioMostrar = v.precio_final ?? v.precio;

      card.innerHTML = `
        <img src="${v.imagen ?? ""}" alt="${v.destino ?? v.nombre ?? "Destino"}" class="viaje-img">
        <h3>${v.destino ?? v.nombre ?? "Destino"}</h3>
        <p>${v.descripcion ?? ""}</p>
        <span class="precio">Precio: ${precioMostrar} €</span>
        <p class="fechas">Inicio: ${formatearFecha(v.fecha_inicio)} | Fin: ${formatearFecha(v.fecha_fin)}</p>
        ${avisoHTML}
        <button class="btn-reservar">Reservar</button>
      `;

      const btn = card.querySelector('.btn-reservar');
      btn.addEventListener('click', () => reservarViaje(v.id, v.fecha_inicio, v.fecha_fin, v));
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando viajes:', error);
    const contenedor = document.getElementById('lista_viajes');
    contenedor.innerHTML = '<p>Error al cargar los viajes. Inténtalo más tarde.</p>';
  }
}

function formatearFecha(fechaISO) {
  const d = parseFechaSinHora(fechaISO);
  if (!d) return "No disponible";
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const año = d.getFullYear();
  return `${dia}/${mes}/${año}`;
}

async function reservarViaje(idViaje, fechaInicioStr, fechaFinStr, viajeObj) {
  const camposObligatorios = ["destino", "descripcion", "precio", "fecha_inicio", "fecha_fin"];
  for (const campo of camposObligatorios) {
    if (!viajeObj[campo] || viajeObj[campo].toString().trim() === "") {
      alert(`❌ El campo obligatorio "${campo}" está vacío.`);
      return;
    }
  }

  if (!validarFechasReserva(fechaInicioStr, fechaFinStr)) return;

  try {
    const res = await fetchWithAuth(`/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viaje_id: idViaje })
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Reserva realizada con éxito');
    } else {
      console.error("Error backend:", data);
      alert(`❌ Error al realizar la reserva: ${data.error}${data.detalle ? " - " + data.detalle : ""}`);
    }
  } catch (error) {
    console.error('Error en la reserva:', error);
    alert("❌ No se pudo realizar la reserva. Inténtalo más tarde.");
  }
}

document.addEventListener('DOMContentLoaded', cargarViajes);
