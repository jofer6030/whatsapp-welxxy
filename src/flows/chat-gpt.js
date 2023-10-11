import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { index } from "./pinecone.js";
import { getMemoryConversationAll } from "./history-memory.js";

export const questionToChatGpt = async (question, nroCell) => {
  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env["OPENAI_API_KEY"],
  }).embedQuery(question);

  let qOne = index.query({
    topK: 3,
    vector: queryEmbedding,
    includeMetadata: true,
    filter: {
      typeFile: "chat",
    },
  });

  let qTwo = index.query({
    topK: 2,
    vector: queryEmbedding,
    includeMetadata: true,
    filter: {
      typeFile: "information",
    },
  });

  const [queryResponseChat, queryResponseInfo] = await Promise.all([qOne, qTwo]);

  if (queryResponseChat.matches.length || queryResponseInfo.matches.length) {
    const CONTENT_CHAT = queryResponseChat.matches.map((match) => match.metadata.pageContent).join(" ");

    console.log(CONTENT_CHAT)

    const CONTENT_INFO = queryResponseInfo.matches.map((match) => match.metadata.pageContent).join(" ");
    console.log("========================================")
    console.log(CONTENT_INFO)

    const ND = "Lo siento, pero no lo sé";

    const historyConversation =
      getMemoryConversationAll(nroCell).length > 0
        ? [...getMemoryConversationAll(nroCell), { role: "user", content: question }]
        : [{ role: "user", content: question }];

    try {
      const result = await new ChatOpenAI().completionWithRetry({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
          Eres una IA FAQ, a partir de ahora vas a limitarte a contestar preguntas sobre la empresa con este contenido: ${CONTENT_INFO} (si el usuario desea informacion dar como repsuesta la informacion directa de la empresa, sin la necesidad de que te especifique que infromacion requiere), tambien puedes guiarte con estos ejemplos de chat ${CONTENT_CHAT}. NO DES MÁS INFORMACIÓN Y NO SUPONAGAS NADA. No contestes con Respuesta: o según el contenido.
          Habla como si tú sugieres.
          Como FAQ debes dar repuestas cortas y precisas y dar la respuesta en en lenguaje sencillo y cercano. Cuando no sepas la respuesta o tengas dudas contesta con la siguiente frase '${ND}'`,
          },
          ...historyConversation,
        ],
        temperature: 0.,
        top_p: 1,
        max_tokens: 2000,
      });
      return result.choices[0].message.content;
    } catch (error) {
      console.log(error.message)
    }
  } else {
    console.log("No se encontro respuesta");
  }
};
