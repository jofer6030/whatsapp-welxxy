import ApiService from "../../services/api.service.js";

import { sanitizeText } from "../../utils/sanitizeText.util.js";
import { isDateValid, isFormatDateValid } from "../../utils/isDateValid.util.js";
import { isEmailValid } from "../../utils/isEmailValid.util.js";

import * as flow from "../../utils/enumFlow.util.js";
import * as message from "./messages.js";
import { getStateFlow, memoryConversation } from "../../utils/memoryConversation.js";
import { isDniValid } from "../../utils/isDniValid.util.js";

const apiService = new ApiService();

export const wellxxyCompra = async (infoText, nroCell, name) => {
  const keyWord = sanitizeText(infoText.text);
  const stateFlow = getStateFlow(nroCell, keyWord);

  memoryConversation(nroCell, { state: stateFlow, messageUser: keyWord });

  let msg;

  switch (stateFlow) {
    case flow.WELCOME_USER:
      msg = await message.Welcome(nroCell, name);
      memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      break;
    case flow.START:
      if (keyWord === "iniciar") {
        try {
          const response = await apiService.getUserByTel(nroCell);
          msg = await message.VerifyInfoUser(nroCell, response.usuario);
          memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
        } catch (error) {
          const response = error.response.data;
          if (response.status === 404 && response.message.toLowerCase() === "usuario no encontrado") {
            msg = await message.TermsConditions(nroCell);
            memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageCompany: msg });
          }
        }
      } else {
        msg = await message.Welcome(nroCell, name);
        memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      }

      break;
    case flow.TERMS_CONDITIONS:
      if (["✅si", "si"].includes(keyWord)) {
        await apiService.createUser({ nro_celular: nroCell });
        msg = await message.ToGetDni(nroCell);
        memoryConversation(nroCell, { state: flow.GET_DNI, messageCompany: msg });
      } else if (["❌no", "no"].includes(keyWord)) {
        msg = await message.FinishFlow(nroCell);
        memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Responder solo: *Si* o *No*");
        memoryConversation(nroCell, { state: flow.TERMS_CONDITIONS, messageCompany: msg });
      }
      break;
    case flow.GET_DNI:
      if (isDniValid(keyWord)) {
        await apiService.updateUser({ number: nroCell, dni: keyWord });
        msg = await message.ToGetDateBirth(nroCell);
        memoryConversation(nroCell, { state: flow.GET_DATE_BIRTH, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Por favor proporcione un DNI válido");
        memoryConversation(nroCell, { state: flow.GET_DNI, messageCompany: msg });
      }
      break;
    case flow.GET_DATE_BIRTH:
      if (isDateValid(keyWord) && isFormatDateValid(keyWord)) {
        await apiService.updateUser({ number: nroCell, fecha_nacimiento: keyWord });
        msg = await message.ToGetEmail(nroCell);
        memoryConversation(nroCell, { state: flow.GET_EMAIL, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Por favor proporcione una fecha válida");
        memoryConversation(nroCell, { state: flow.GET_DATE_BIRTH, messageCompany: msg });
      }
      break;
    case flow.GET_EMAIL:
      if (isEmailValid(keyWord)) {
        const userUpdated = await apiService.updateUser({ number: nroCell, correo: keyWord });
        msg = await message.VerifyInfoUser(nroCell, userUpdated.user);
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Por favor proporcione un correo válido");
        memoryConversation(nroCell, { state: flow.GET_EMAIL, messageCompany: msg });
      }
      break;
    case flow.VERIFY_USER:
      if (["si", "correctos", "si, correctos"].includes(keyWord)) {
        const data = await apiService.getUserByTel(nroCell);
        const {
          usuario: { dni, fecha_nacimiento, correo },
        } = data;
        if (!dni || !fecha_nacimiento || !correo) {
          const msg1 = await message.ToCompleteInfo(nroCell);
          const msg2 = await message.VerifyInfoUser(data.usuario);
          msg = msg1 + msg2;
          memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
        } else {
          msg = await message.ToSureBuy(nroCell);
          memoryConversation(nroCell, { state: flow.SURE_TO_BUY, messageCompany: msg });
        }
      } else if (["no", "actualizar", "no, actualizar"].includes(keyWord)) {
        msg = await message.ToFixInfo(nroCell);
        memoryConversation(nroCell, { state: flow.FIX_INFO, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Responder solo: *Si* o *No*");
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      }
      break;
    case flow.SURE_TO_BUY:
      if (["si, comprar!", "si", "comprar"].includes(keyWord)) {
        msg = await message.ToGetAddress(nroCell);
        memoryConversation(nroCell, { state: flow.GET_ADDRESS, messageCompany: msg });
      } else if (["no, gracias", "no"].includes(keyWord)) {
        msg = await message.FinishFlow(nroCell);
        memoryConversation(nroCell, { state: flow.START, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(nroCell, "Para comprar responder solo: *Si* o *No*");
        memoryConversation(nroCell, { state: flow.SURE_TO_BUY, messageCompany: msg });
      }
      break;
    case flow.FIX_INFO:
      if (keyWord === "dni" && isDniValid(keyWord)) {
        const userUpdated = await apiService.updateUser({ number: nroCell, dni: keyWord });
        msg = await message.VerifyInfoUser(nroCell, userUpdated.user);
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      } else if (
        ["fecha", "fecha de nacimiento"].includes(keyWord) &&
        isDateValid(keyWord) &&
        isFormatDateValid(keyWord)
      ) {
        const userUpdated = await apiService.updateUser({ number: nroCell, fecha_nacimiento: keyWord });
        msg = await message.VerifyInfoUser(nroCell, userUpdated.user);
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      } else if (keyWord === "correo" && isEmailValid(keyWord)) {
        const userUpdated = await apiService.updateUser({ number: nroCell, correo: keyWord });
        msg = await message.VerifyInfoUser(nroCell, userUpdated.user);
        memoryConversation(nroCell, { state: flow.VERIFY_USER, messageCompany: msg });
      } else {
        msg = await message.ValidateMessage(
          nroCell,
          "Por favor proporcione una opción valida: *DNI*, *Fecha de nacimiento* o *Correo*"
        );
        memoryConversation(nroCell, { state: flow.FIX_INFO, messageCompany: msg });
      }
      break;
    case flow.GET_ADDRESS:
      await apiService.createOrden({ nro_celular: nroCell, direccion_envio: textLower });
      msg = await message.ToOrderDone(nroCell);
      memoryConversation(nroCell, { state: flow.ORDER_DONE, messageCompany: msg });
      break;
    case flow.ORDER_DONE:
      msg = await message.VerifyOrder(nroCell);
      memoryConversation(nroCell, { state: flow.ORDER_DONE, messageCompany: msg });
      break;
  }
};
