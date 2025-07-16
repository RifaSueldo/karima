// lunara.js (frontend)

let estado = "saludo";
let nombre = "";
let sexo = "";
let historia = "";
let cartasSeleccionadas = [];
let indiceCarta = 0;

const mazo = [
  { nombre: "La Estrella", img: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", breve: "Esperanza, guía, inspiración." },
  { nombre: "La Muerte", img: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", breve: "Transformación profunda, fin de ciclo." },
  { nombre: "El Sol", img: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", breve: "Alegría, claridad, éxito." },
  { nombre: "El Colgado", img: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", breve: "Rendición, nueva perspectiva, pausa." },
  { nombre: "La Luna", img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", breve: "Ilusiones, intuición, mundo interior." },
  { nombre: "La Templanza", img: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", breve: "Armonía, sanación, equilibrio." }
];

function agregarMensaje(texto, clase = "lunara") {
  const div = document.createElement("div");
  div.className = `mensaje ${clase}`;
  div.innerText = texto;
  document.getElementById("chat").appendChild(div);
  document.getElementById("chat").scrollTop = 9999;
}

function enviarMensaje() {
  const input = document.getElementById("entrada");
  const texto = input.value.trim();
  if (!texto) return;
  agregarMensaje(texto, "usuario");
  input.value = "";
  procesarMensaje(texto.toLowerCase());
}

function procesarMensaje(texto) {
  if (estado === "saludo") {
    const hora = new Date().getHours();
    let saludo = "Buenas noches";
    if (hora < 12) saludo = "Buenos días";
    else if (hora < 19) saludo = "Buenas tardes";
    agregarMensaje(`${saludo}. Soy Madame Lunara. ¿Querés comentarme qué te trae por estos lados antes de tirar las cartas? Necesito saber tu nombre y sexo.`);
    estado = "pedirNombreSexo";
    return;
  }

  if (estado === "pedirNombreSexo") {
    const partes = texto.split(" ");
    nombre = partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1) || "Consultante";
    sexo = partes.includes("hombre") ? "hombre" : partes.includes("mujer") ? "mujer" : "otro";
    agregarMensaje(`Gracias, ${nombre}. ¿Querés contarme algo o tiramos las cartas? Solo decime 'tirar cartas' visualizando lo que querés saber.`);
    estado = "esperandoDecision";
    return;
  }

  if (estado === "esperandoDecision") {
    if (texto.includes("tirar")) {
      cartasSeleccionadas = mazo.sort(() => 0.5 - Math.random()).slice(0, 3);
      indiceCarta = 0;
      agregarMensaje("Muy bien... comencemos. ✨ Concentrate en tu energía.");
      setTimeout(() => mostrarCarta(), 1000);
      estado = "tirandoCartas";
    } else {
      historia += texto + " ";
      agregarMensaje("Gracias por compartirlo. ¿Querés que tiremos las cartas ahora?");
    }
    return;
  }

  if (estado === "tirandoCartas") {
    if (texto.includes("sí") || texto.includes("si")) {
      mostrarCarta();
    } else {
      agregarMensaje("Tomate tu tiempo. Cuando estés listo, decime 'sí'.");
    }
    return;
  }
}

function mostrarCarta() {
  if (indiceCarta >= cartasSeleccionadas.length) {
    agregarMensaje("Ahora que las tres cartas han hablado… permitime conectar con su energía conjunta. 🔮");
    interpretarTirada(cartasSeleccionadas.map(c => c.nombre));
    estado = "finalizado";
    return;
  }

  const carta = cartasSeleccionadas[indiceCarta];
  const div = document.createElement("div");
  div.className = "mensaje lunara";
  div.innerHTML = `
    <strong>Carta ${indiceCarta + 1}: ${carta.nombre}</strong><br/>
    <img class="carta" src="${carta.img}" alt="${carta.nombre}" /><br/>
    <em>${carta.breve}</em>
  `;
  document.getElementById("chat").appendChild(div);
  document.getElementById("chat").scrollTop = 9999;

  indiceCarta++;
  if (indiceCarta < 3) {
    setTimeout(() => agregarMensaje(`¿Vamos con la ${indiceCarta + 1}ª carta?`), 1000);
  } else {
    setTimeout(() => mostrarCarta(), 2000);
  }
}

async function interpretarTirada(cartas) {
  try {
    const res = await fetch("/.netlify/functions/lunara", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartas, nombre, sexo, historia })
    });
    const data = await res.json();
    agregarMensaje("🌙 " + data.interpretacion);
  } catch (e) {
    agregarMensaje("Error al conectar con el servidor. Por favor, intentá de nuevo más tarde.");
  }
}
