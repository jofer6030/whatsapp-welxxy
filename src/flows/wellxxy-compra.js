import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import { sanitizeText } from "../utils/sanitizeText.util.js";

import { sendButtonText, sendButtonDocument, sendButtonImage, sendText } from "../shared/msgWhatssapModels.shared.js";
import { isDateValid } from "../utils/isDateValid.util.js";

const user = {
  isNew: true,
  data: {
    tel: "5112345678",
    dni: "12345678",
    fechaNacimiento: "01-01-1990",
  },
};

const verifyUser = (user) => ({
  bodyText: `¿Tus datos son correctos?\n*N°Tel:* ${user.data.tel}\n*Dni:* ${user.data.dni}\n*Fecha de Nacimiento:* ${user.data.fechaNacimiento}`,
  listBtns: [
    { id: "info-correct-si", text: "✅Si, correctos" },
    { id: "info-correct-no", text: "❌No, actualizar" },
  ],
});

export const wellxxyCompra = async (infoText, number, name) => {
  console.log("Client:", infoText.text);
  const textLower = sanitizeText(infoText.text);
  console.log("Client:", textLower);
  if (textLower === "hola") {
    return await sendWhatsappMsg(
      sendButtonImage(number, {
        image: "https://th.bing.com/th/id/OIP.AfU6ELNHUNbAUlnss1CPwQHaHa?pid=ImgDet&rs=1",
        bodyText: `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`,
        listBtns: [{ id: "iniciar", text: "Iniciar" }],
      })
    );
  }
  if (textLower === "iniciar" || infoText.id === "btn-iniciar") {
    if (user.isNew) {
      return await sendWhatsappMsg(
        sendButtonDocument(number, {
          document: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
          filename: "Términos y condiciones",
          bodyText: "¿Aceptas nuestros términos y condiciones?",
          listBtns: [
            { id: "terminos-si", text: "✅Si" },
            { id: "terminos-no", text: "❌No" },
          ],
        })
      );
    }
    return await sendWhatsappMsg(sendButtonText(number, verifyUser(user)));
  }
  if (infoText.id === "btn-terminos-si") {
    await sendWhatsappMsg(
      sendText(
        number,
        "Para poder continuar, necesitamos algunos datos adicionales. Estos datos son necesarios para asegurarnos de brindarte el mejor servicio posible y cumplir con nuestras políticas de seguridad y privacidad. Una vez que hayas ingresado estos datos, estaremos listos para continuar. ¡Gracias!"
      )
    );
    await sendWhatsappMsg(
      sendText(
        number,
        "Por favor, proporciona tu número de DNI con el siguiente formato: *Dni:numeroDni*, ejemplo: Dni:12345678"
      )
    );
    return;
  }
  if (infoText.id === "btn-terminos-no") {
    return await sendWhatsappMsg(sendText(number, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
  }
  if (!isNaN(Number(textLower))) {
    if (textLower.length !== 8) {
      return await sendWhatsappMsg(
        sendText(number, "El número de DNI debe tener 8 dígitos, por favor, vuelve a intentarlo")
      );
    }
    // TODO: Crear usuario en la base de datos con el dni
    return await sendWhatsappMsg(
      sendText(
        number,
        "Ahora, proporciona tu fecha de nacimiento con el siguiente formato: *Fecha:dd-mm-aaaa* (dia-mes-año), ejemplo: Fecha:01-01-1990"
      )
    );
  }
  if (textLower.includes("-")) {
    if (isDateValid(textLower)) {
      // TODO: Actualizar usuario en la base de datos con la fecha de nacimiento
      return await sendWhatsappMsg(sendButtonText(number, verifyUser(user)));
    }
    return await sendWhatsappMsg(
      sendText(number, "El formato de la fecha de nacimiento es incorrecto, por favor, vuelve a intentarlo")
    );
  }
  if (textLower === "no actualizar" || infoText.id === "btn-info-correct-no") {
    return await sendWhatsappMsg(
      sendText(
        number,
        "Actualicemos tus datos, Por favor, proporciona tu número de DNI con el siguiente formato: *Dni:numeroDni*, ejemplo: Dni:12345678"
      )
    );
  }
  if (textLower === "si correctos" || infoText.id === "btn-info-correct-si") {
    return await sendWhatsappMsg(
      sendButtonText(number, {
        bodyText: `¿Desea comprar el producto?`,
        listBtns: [
          { id: "comprar-si", text: "✅Si, comprar!" },
          { id: "comprar-no", text: "❌No, gracias" },
        ],
      })
    );
  }
  if (textLower === "no gracias" || infoText.id === "btn-comprar-no") {
    return await sendWhatsappMsg(sendText(number, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
  }
  if (textLower === "si comprar" || infoText.id === "btn-comprar-si") {
    return await sendWhatsappMsg(
      sendText(
        number,
        "¡Perfecto! Por favor, proporciona la dirección de entrega con el siguiente formato: *Dirección: tu dirección*, ejemplo: Dirección:Av. Javier Prado 1234, San Isidro"
      )
    );
  }
  if (["av.", "jr.", "psje.", "calle.", "cra.", "pasaje."].some((word) => textLower.includes(word))) {
    // se envia en link de pago mercado pago
    return await sendWhatsappMsg(
      sendText(
        number,
        "Ahora te enviaremos un link de pago para que puedas realizar la compra. Una vez que hayas realizado el pago, te enviaremos un mensaje de confirmación con la fecha de entrega. ¡Gracias!"
      )
    );
  }
};
