import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import { sendText } from "../shared/msgWhatssapModels.shared.js";

import { sanitizeText } from "../utils/sanitizeText.util.js";
import { questionToChatGpt } from "./chat-gpt.js";
import { getMemoryConversationAll, memoryConversation } from "./history-memory.js";

export const wellxxyCompra = async (infoText, userPhoneNumber, name) => {
  const keyWord = sanitizeText(infoText.text);

  const responseChatGpT = await questionToChatGpt(keyWord, userPhoneNumber);

  memoryConversation(userPhoneNumber, { role: "user", content: keyWord });
  memoryConversation(userPhoneNumber, { role: "assistant", content: responseChatGpT });

  await sendWhatsappMsg(sendText(userPhoneNumber, responseChatGpT || "Lo siento, no entendi"));
  if (
    responseChatGpT &&
    responseChatGpT.includes("😊") ||
    responseChatGpT.includes("⏳") ||
    responseChatGpT.includes("🙏") ||
    responseChatGpT.includes("Estaremos en contacto en breve, en un plazo de 10 minutos") ||
    responseChatGpT.includes("10 minutos")
  ) {
    const summaryOrder = getMemoryConversationAll(userPhoneNumber).findLast(item => {
      return item.role === "assistant" && item.content.includes("Resumen de la orden")
    }).content
    const formatSummaryOrder = summaryOrder.split("\n\n").find(item => item.includes("Resumen"))
    const formatResult = formatSummaryOrder + `\n- NroCel:${userPhoneNumber}`;
    console.log(formatResult)

    await sendWhatsappMsg(sendText('51922545942', formatResult));
  }
  return;
};
