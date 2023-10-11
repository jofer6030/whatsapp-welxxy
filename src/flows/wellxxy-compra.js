import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import { sendText } from "../shared/msgWhatssapModels.shared.js";

import { sanitizeText } from "../utils/sanitizeText.util.js";
import { questionToChatGpt } from "./chat-gpt.js";
import { memoryConversation } from "./history-memory.js";

export const wellxxyCompra = async (infoText, userPhoneNumber, name) => {
  const keyWord = sanitizeText(infoText.text);

  const responseChatGpT = await questionToChatGpt(keyWord, userPhoneNumber);

  memoryConversation(userPhoneNumber, { role: "user", content: keyWord });
  memoryConversation(userPhoneNumber, { role: "assistant", content: responseChatGpT });

  await sendWhatsappMsg(sendText(userPhoneNumber, responseChatGpT));
  return;
};
