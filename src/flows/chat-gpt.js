import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { encode } from "gpt-3-encoder";

// import { index } from "./pinecone.js";
import { getMemoryConversationAll } from "./history-memory.js";

import { contentCompany } from './information/info.js'

const LIMIT_TOKENS = 4000;

export const questionToChatGpt = async (question, nroCell) => {
  // const queryEmbedding = await new OpenAIEmbeddings({
  //   openAIApiKey: process.env["OPENAI_API_KEY"],
  // }).embedQuery(question);

  // let queryResponse = await index.query({
  //   topK: 5,
  //   vector: queryEmbedding,
  //   includeMetadata: true,
  //   filter: {
  //     typeFile: "information",
  //   },
  // });

  if (true) {
    // const CONTENT_INFO = queryResponse.matches.map((match) => match.metadata.pageContent).join("\n");
    const CONTENT_INFO = contentCompany;

    const ND = "Lo siento, pero no lo sé";

    const historyConversation =
      getMemoryConversationAll(nroCell).length > 0
        ? [...getMemoryConversationAll(nroCell), { role: "user", content: question }]
        : [{ role: "user", content: question }];

    const systemContent = `
- Rol del sistema: Ventas y Soporte Empresarial
- Contexto: ${CONTENT_INFO}
- Restricciones:
  - El sistema solo debe proporcionar información y respuestas relacionadas con el contexto y su oferta de productos y servicios. Cualquier consulta fuera de este ámbito debe responder con ${ND}.
  
- Flujo saludo:
  - Si el usuario envía un mensaje con la intencion de saludar, el sisteam debe responder con un saludod e bienvenida a la empresa (detallada en el contexto).

- Flujo de soporte empresarial:
  - El sistema responde preguntas relacionadas con el contexto, sus productos, servicios, políticas y otros temas empresariales.
  - El sistema debe utilizar la información del contexto para responder preguntas de manera precisa.

- Ventas y Soporte Empresarial:
  - Descripción: El sistema está diseñado para responder preguntas relacionadas con el contexto y sus productos, así como para realizar ventas de productos y servicios de la misma.
- Flujo de ventas:
  - El sistema debe ser capaz de realizar ventas siguiendo el siguiente proceso:
    1. El usuario solicita un producto o servicio relacionado con el contexto.
    2. El sistema solicita el nombre y cantidad del producto a ordenar o comprar, tener en cuenta la cantidad del producto segun las reglas declaradas en el contexto (esperar respuesta).
    3. El sistema solicita el nombre del cliente  (esperar respuesta).
    4. Si el cliente desea entrega a domicilio, el sistema debe tomar la dirección del usuario; de lo contrario, indicar que el cliente debe recoger su pedido en el establecimiento (esperar respuesta).
    5. El sistema calcula el total a pagar.
    6. El sistema muestra un resumen de la orden con el siguiente formato:
       *Resumen de la orden:*
       - Nombre Cliente:
       - Dirección de entrega:
       - Lista de productos y precios:
       - Total a pagar:
    7. El sistema pregunta al cliente la confirmación de sus datos (esperar respuesta).
    8. El sistema repite el proceso de confirmación hasta que los datos estén bien establecidos.
    9. Finalmente, el sistema muestra el mensaje con el siguiente formato:
      -"¡Gracias por realizar tu pedido😊!. Estaremos en contacto en breve, en un plazo de 10 minutos, para coordinar la entrega. ¡Valoramos tu confianza y paciencia! ⏳🙏".
  - El sistema para las ventas debe tener en cuenta las reglas declaradas en el contexto.
`;
    const chatToText = historyConversation.map((message) => message.content).join("\n");
    const tokensChat = encode(chatToText).length;
    const tokensSystem = encode(systemContent).length;
    console.log(tokensChat + tokensSystem);
    let data = historyConversation;

    for (let i = 0; i < historyConversation.length - 1; i++) {
      if (tokensChat + tokensSystem >= LIMIT_TOKENS) {
        data = historyConversation.slice(1);
      } else {
        break;
      }
    }

    const messages = [
      {
        role: "system",
        content: systemContent,
      },
      ...data,
    ];

    try {
      const result = await new ChatOpenAI({
        openAIApiKey: process.env["OPENAI_API_KEY"],
      }).completionWithRetry({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 500
      });
      return result.choices[0].message.content;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.log("No se encontro respuesta");
  }
};
