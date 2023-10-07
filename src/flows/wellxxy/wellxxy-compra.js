import ApiService from "../../services/api.service.js";
import {
  sendButtonText,
  sendButtonDocument,
  sendButtonImage,
  sendText,
} from "../../shared/msgWhatssapModels.shared.js";

import { sendWhatsappMsg } from "../../utils/sendWhatsappMsg.util.js";
import { sanitizeText } from "../../utils/sanitizeText.util.js";
import { isDateValid, isFormatDateValid } from "../../utils/isDateValid.util.js";
import { isEmailValid } from "../../utils/isEmailValid.util.js";

import * as flow from "../../utils/enumFlow.util.js";
import * as message from "./messages.js";
import { getStateFlow,memoryConversation } from "../../utils/memoryConversation.js";

const apiService = new ApiService();

export const wellxxyCompra = async (infoText, nroCell, name) => {
  const keyWord = sanitizeText(infoText.text);
  const stateFlow = getStateFlow(nroCell, keyWord);

  switch (stateFlow) {
    case flow.WELCOME_USER:
      const msg = await message.Welcome(nroCell, name);
      memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      break;

    case flow.START:
      memoryConversation(nroCell, { state: flow.START, messageUser: keyWord });
      if (keyWord === "iniciar") {
        try {
          const response = await apiService.getUserByTel(nroCell);
          const msg = await message.VerifyInfoUser(nroCell, response.user);
          memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
        } catch (error) {
          const response = error.response.data;
          if (
            response.status === 404 &&
            response.message.toLowerCase() === "usuario no encontrado"
          ) {
            const msg = await message.TermsConditions(nroCell);
            memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageCompany: msg });
          }
        }
      } else {
        const msg = await message.Welcome(nroCell, name);
        memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      }

      break;
    case flow.TERMS_CONDITIONS:
      memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageUser: keyWord });
      if (["✅si", "si"].includes(keyWord)) {
        await apiService.createUser({ nro_celular: nroCell });
        const msg = await message.ToGetDni(nroCell);
        memoryConversation(nroCell, { state: flow.GET_DNI, messageCompany: msg });
      } else if (["❌no", "no"].includes(keyWord)) {
        const msg = await message.FinishFlow(nroCell);
        memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      } else {
        const msg = await message.ValidateMessage(nroCell, "Si - No");
        memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageCompany: msg });
      }
      break;
  }
};
