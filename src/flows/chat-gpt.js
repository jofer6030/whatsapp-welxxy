import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { encode } from "gpt-3-encoder";

import { index } from "./pinecone.js";
import { getMemoryConversationAll, memoryConversation } from "./history-memory.js";

const LIMIT_TOKENS = 4000;

export const questionToChatGpt = async (question, nroCell) => {
  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env["OPENAI_API_KEY"],
  }).embedQuery(question);

  let queryResponse = await index.query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
    filter: {
      typeFile: "information",
    },
  });

  if (queryResponse.matches.length) {
    const CONTENT_INFO = queryResponse.matches.map((match) => match.metadata.pageContent).join("\n");

    const ND = "Lo siento, pero no lo sé";

    const historyConversation =
      getMemoryConversationAll(nroCell).length > 0
        ? [...getMemoryConversationAll(nroCell), { role: "user", content: question }]
        : [{ role: "user", content: question }];

    const systemContent = `- Eres una IA FAQ, a partir de ahora vas a limitarte a contestar preguntas sobre la empresa con este contenido: ${CONTENT_INFO}.
- Si el usuario realiza una orden realiza los siguientes pasos:
  -Tomar la orden hasta el total a pagar, no olvidar solicitar el nombre del usuario.
  -Si desea entrega a domicilio tomar la dirección del usuario, si no desea entrega a domicilio tomar la dirección de la empresa.
  -Finalmente, dar un resumen de la order con el siguiente formato:
    *Resumen de la orden:*
    - Nombre:
    - Dirección:
    - Lista de productos y precios:
    - Total a pagar:
    - Fecha y hora de la orden:
  - La fecha debe estar en formato DD/MM/YYYY HH:MM:SS (zona horaria UTC-5).
- NO DES MÁS INFORMACIÓN Y NO SUPONAGAS NADA.
- Como FAQ debes dar repuestas cortas y precisas y dar la respuesta en en lenguaje sencillo y cercano. Cuando no sepas la respuesta o tengas dudas contesta con la siguiente frase '${ND}'
`;
    const chatToText = historyConversation.map((message) => message.content).join("\n");
    const tokensChat = encode(chatToText).length;
    const tokensSystem = encode(systemContent).length;

    let data = historyConversation;

    for (i = 0; i < historyConversation.length - 1; i++) {
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
      const result = await new ChatOpenAI().completionWithRetry({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 300,
      });
      return result.choices[0].message.content;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.log("No se encontro respuesta");
  }
};
