// netlify/functions/lunara.js
export async function handler(event) {
  try {
    const { cartas } = JSON.parse(event.body);

    const prompt = `Actuás como una tarotista digital llamada Madame Lunara. Alguien acaba de tirar tres cartas del tarot. Debés interpretar la combinación como si estuvieras en una sesión íntima, mística y respetuosa. No repitas el significado literal de cada carta. En cambio, ofrecé una lectura que combine su energía, que hable de lo emocional, espiritual y simbólico. Usá un tono profundo, poético, suave. No des fechas exactas ni predicciones duras, solo guía, intuición y metáforas. Las cartas son: ${cartas.join(", ")}.`;

    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.9
      })
    });

    const data = await respuesta.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ interpretacion: data.choices[0].message.content })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

