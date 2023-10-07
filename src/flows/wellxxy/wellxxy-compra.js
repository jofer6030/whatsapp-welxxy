import ApiService from "../../services/api.service.js";
import {
  sendButtonText,
  sendButtonDocument,
  sendButtonImage,
  sendText,
} from "../../shared/msgWhatssapModels.shared.js";

import { getStateFlow, memoryConversation } from "../../utils/memoryConversation.js";

import { sendWhatsappMsg } from "../../utils/sendWhatsappMsg.util.js";
import { sanitizeText } from "../../utils/sanitizeText.util.js";
import { isDateValid, isFormatDateValid } from "../../utils/isDateValid.util.js";
import { isEmailValid } from "../../utils/isEmailValid.util.js";

import * as flow from "../../utils/enumFlow.util.js";
import * as message from "./messages.js";

const apiService = new ApiService();

export const wellxxyCompra = async (infoText, nroCell, name) => {
  const keyWord = sanitizeText(infoText.text);
  const stateFlow = getStateFlow(nroCell, keyWord);

  switch (stateFlow) {
    case flow.WELCOME_USER:
      await message.Welcome(nroCell, name);
      memoryConversation(nroCell, { state: flow.START, message: keyWord });
      break;

    case flow.START:
      if (keyWord === "iniciar") {
        try {
          const response = await apiService.getUserByTel(nroCell);
          await message.VerifyInfoUser(nroCell, response.user);
          memoryConversation(nroCell, { state: flow.VERIFY_USER });
        } catch (error) {
          const response = error.response.data;
          if (response.status === 404 && response.message.toLowerCase() === "usuario no encontrado") {
            await message.TermsConditions(nroCell);
            memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS });
          }
        }
      } else {
        await message.Welcome(nroCell, name);
      }
      break;
    case flow.TERMS_CONDITIONS:
      if (["✅si", "si"].includes(keyWord)) {
        await apiService.createUser({ nro_celular: nroCell });
        await message.ToGetDni(nroCell);
        memoryConversation(nroCell, { state: flow.DOCUMENT_ID });
      } else if (["❌no", "no"].includes(keyWord)) {
        await message.FinishFlow(nroCell);
        memoryConversation(nroCell, { state: flow.WELCOME_USER });
      } else {
        await message.ValidateMessage(nroCell, "Si - No");
      }
      break;
    case flow.DOCUMENT_ID:
  }
};
