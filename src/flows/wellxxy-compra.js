import ApiService from "../services/api.service.js";

import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import { sendButtonText, sendButtonDocument, sendButtonImage, sendText } from "../shared/msgWhatssapModels.shared.js";

import { sanitizeText } from "../utils/sanitizeText.util.js";
import { questionToChatGpt } from "./chat-gpt.js";

export const wellxxyCompra = async (infoText, userPhoneNumber, name) => {
  const keyWord = sanitizeText(infoText.text);

  const responseChatGpT = await questionToChatGpt(keyWord);
  await sendWhatsappMsg(userPhoneNumber, sendText(responseChatGpT, name));
};
