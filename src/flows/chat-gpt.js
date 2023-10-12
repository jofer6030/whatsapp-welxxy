import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { encode } from "gpt-3-encoder";

import { index } from "./pinecone.js";
import { getMemoryConversationAll } from "./history-memory.js";

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
    const CONTENT_INFO = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");

    const ND = "Lo siento, pero no lo sé";

    const historyConversation =
      getMemoryConversationAll(nroCell).length > 0
        ? [...getMemoryConversationAll(nroCell), { role: "user", content: question }]
        : [{ role: "user", content: question }];

    const chatToText = historyConversation.map((message) => message.content).join("\n");

    const messages = [
      {
        role: "system",
        content: `
- Eres una IA FAQ, a partir de ahora vas a limitarte a contestar preguntas sobre la empresa con este contenido: ${CONTENT_INFO}.
- Si el usuario realiza una orden, tomar la orden hasta el total a pagar, para dar un resumen de su orden, finalmente indicar que el numero de contacto establecido en el contenido se comunicara con usted.
- NO DES MÁS INFORMACIÓN Y NO SUPONAGAS NADA.
- Como FAQ debes dar repuestas cortas y precisas y dar la respuesta en en lenguaje sencillo y cercano. Cuando no sepas la respuesta o tengas dudas contesta con la siguiente frase '${ND}'`,
      },
      ...historyConversation,
    ];

    try {
      const result = await new ChatOpenAI().completionWithRetry({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 1000,
      });
      return result.choices[0].message.content;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.log("No se encontro respuesta");
  }
};
