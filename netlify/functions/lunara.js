// netlify/functions/lunara.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const { cartas, nombre, sexo, historia } = JSON.parse(event.body);

    const prompt = `Sos Madame Lunara, una tarotista intuitiva, amable, sabia y mística.
Te habla un consultante llamado ${nombre}, que se identifica como ${sexo}.
Ha contado lo siguiente: "${historia}".
Has tirado estas tres cartas: ${cartas.join(", ")}.
Ahora debes hacer una interpretación mística, breve, emocional y coherente, que una los significados de las tres cartas entre sí, dirigida al consultante por su nombre.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sos Madame Lunara, una tarotista dulce, intuitiva y mística. Tus respuestas deben ser breves, sentidas y con un tono esotérico serio y cálido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const respuesta = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ interpretacion: respuesta })
    };

  } catch (error) {
    console.error("Error en Madame Lunara:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hubo un error al interpretar las cartas." })
    };
  }
};
