import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { index } from "./pinecone.js";

export const questionToChatGpt = async (question, name) => {
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  let queryResponse = await index.query({
    topK: 3,
    vector: queryEmbedding,
    includeMetadata: true,
  });
  if (queryResponse.matches.length) {
    const CONTENT = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");

    const ND = "Lo siento, pero no lo sé";
    const result = await new ChatOpenAI().completionWithRetry({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          Eres una IA FAQ, a partir de ahora vas a limitarte a contestar preguntas sobre este contenido: ${CONTENT},En un saludo de parte del usuario, dar la bienvenida resaltando el nombre de la empresa.Si tu respuesta lo requiere usa este nombre ${name} NO DES MÁS INFORMACIÓN Y NO SUPONAGAS NADA. No contestes con Respuesta: o según el contenido.
          Habla como si tú sugieres.
          Como FAQ debes dar repuestas cortas y precisas y dar la respuesta en en lenguaje sencillo y cercano. Cuando no sepas la respuesta o tengas dudas contesta con la siguiente frase '${ND}'`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.5,
      top_p: 1,
    });

    console.log(JSON.stringify(result, null, "\t"));
    return result.choices[0].message.content;
  } else {
    console.log("No se encontro respuesta");
  }
};
