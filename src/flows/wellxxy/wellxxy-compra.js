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
import { getStateFlow, memoryConversation } from "../../utils/memoryConversation.js";

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
          if (response.status === 404 && response.message.toLowerCase() === "usuario no encontrado") {
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
        const msg = await message.ValidateMessage(nroCell, "Responder solo: *Si* o *No*");
        memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageCompany: msg });
      }
      break;
    case flow.GET_DNI:
      memoryConversation(nroCell, { state: flow.GET_DNI, messageUser: keyWord });
      if (keyWord.length === 8 && !isNaN(Number(keyWord))) {
        let info;
        try {
          const { data } = await apiService.getInfoByDni(keyWord);
          info = data;
        } catch (error) {
          console.log(error);
        }
        if (info) {
          const [apellidos, nombres] = info.nombre_completo.split(",");
          await apiService.updateUser({
            number: nroCell,
            dni: keyWord,
            nombres,
            apellidos,
          });
        } else {
          await apiService.updateUser({ number: nroCell, dni: keyWord });
        }

        const msg = await message.ToGetDateBirth(nroCell);
        memoryConversation(nroCell, { state: flow.GET_DATE_BIRTH, messageCompany: msg });
      } else {
        const msg = await message.ValidateMessage(nroCell, "Por favor proporcione un DNI válido");
        memoryConversation(nroCell, { state: flow.GET_DNI, messageCompany: msg });
      }
      break;
    case flow.GET_DATE_BIRTH:
      memoryConversation(nroCell, { state: flow.GET_DATE_BIRTH, messageUser: keyWord });
      if (isDateValid(keyWord) && isFormatDateValid(keyWord)) {
        await apiService.updateUser({ number: nroCell, fecha_nacimiento: keyWord });
        const msg = await message.ToGetEmail(nroCell);
        memoryConversation(nroCell, { state: flow.GET_EMAIL, messageCompany: msg });
      } else {
        const msg = await message.ValidateMessage(nroCell, "Por favor proporcione una fecha válida");
        memoryConversation(nroCell, { state: flow.GET_DATE_BIRTH, messageCompany: msg });
      }
      break;
    case flow.GET_EMAIL:
      memoryConversation(nroCell, { state: flow.GET_EMAIL, messageUser: keyWord });
      if (isEmailValid(keyWord)) {
        const userUpdated = await apiService.updateUser({ number: nroCell, correo: keyWord });
        const msg = await message.VerifyInfoUser(nroCell, userUpdated.user);
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      } else {
        const msg = await message.ValidateMessage(nroCell, "Por favor proporcione un correo válido");
        memoryConversation(nroCell, { state: flow.GET_EMAIL, messageCompany: msg });
      }
      break;
  }
};
