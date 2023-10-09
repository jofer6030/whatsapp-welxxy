import { sendWhatsappMsg } from "../../utils/sendWhatsappMsg.util.js";
import {
  sendButtonDocument,
  sendButtonImage,
  sendButtonText,
  sendText,
} from "../../shared/msgWhatssapModels.shared.js";
import { formatDateFromIso } from "../../utils/formatDateIso.js";

export const Welcome = async (nroCell, name) => {
  await sendWhatsappMsg(
    sendButtonImage(nroCell, {
      image: "https://th.bing.com/th/id/OIP.AfU6ELNHUNbAUlnss1CPwQHaHa?pid=ImgDet&rs=1",
      bodyText: `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`,
      listBtns: [{ id: "iniciar", text: "Iniciar" }],
    })
  );
  return `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`;
};

export const TermsConditions = async (nroCell) => {
  await sendWhatsappMsg(
    sendButtonDocument(nroCell, {
      document: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
      filename: "Términos y condiciones",
      bodyText: "¿Aceptas nuestros términos y condiciones?",
      listBtns: [
        { id: "si", text: "✅Si" },
        { id: "no", text: "❌No" },
      ],
    })
  );
  return "¿Aceptas nuestros términos y condiciones?";
};

export const VerifyInfoUser = async (nroCell, user) => {
  await sendWhatsappMsg(
    sendButtonText(nroCell, {
      bodyText: `
*¿Tus datos son correctos?*

*N°Tel:* ${user.nro_celular || "por definir"}
*Dni:* ${user.dni || "por definir"}
*Fecha de Nacimiento:* ${formatDateFromIso(user.fecha_nacimiento) || "por definir"}
*Correo:* ${user.correo || "por definir"}

Si tienes algun dato *por definir*, por favor, actualizalo presionando el boton *No, actualizar*, de lo contrario no se podra continuar con la compra`,
      listBtns: [
        { id: "info-correct-si", text: "Si, correctos" },
        { id: "info-correct-no", text: "No, actualizar" },
      ],
    })
  );
  return `*¿Tus datos son correctos?*\n\n*N°Tel:* ${user.nro_celular || "por definir"}\n*Dni:* ${
    user.dni || "por definir"
  }\n*Fecha de Nacimiento:* ${formatDateFromIso(user.fecha_nacimiento) || "por definir"}\n*Correo:* ${
    user.correo || "por definir"
  }\n\nSi tienes algun dato *por definir*, por favor, actualizalo presionando el boton *No, actualizar*, de lo contrario no se podra continuar con la compra`;
};

export const ToGetDni = async (nroCell) => {
  await sendWhatsappMsg(
    sendText(
      nroCell,
      "Para poder continuar, necesitamos algunos datos adicionales. Estos datos son necesarios para asegurarnos de brindarte el mejor servicio posible y cumplir con nuestras políticas de seguridad y privacidad. Una vez que hayas ingresado estos datos, estaremos listos para continuar. ¡Gracias!"
    )
  );
  await sendWhatsappMsg(sendText(nroCell, "Por favor, proporciona tu número de DNI, ejemplo: 12345678"));
  return "Por favor, proporciona tu número de DNI, ejemplo: 12345678";
};
export const ToGetDateBirth = async (nroCell) => {
  await sendWhatsappMsg(
    sendText(
      nroCell,
      "Ahora, proporciona tu fecha de nacimiento con el siguiente formato: *dd-mm-aaaa* (dia-mes-año), ejemplos: 01-01-1990"
    )
  );
  return "Ahora, proporciona tu fecha de nacimiento con el siguiente formato: *dd-mm-aaaa* (dia-mes-año), ejemplos: 01-01-1990";
};

export const ToGetEmail = async (nroCell) => {
  await sendWhatsappMsg(
    sendText(nroCell, "Ahora, proporciona tu correo con el siguiente formato: ejemplo@dominio.com")
  );
  return "Ahora, proporciona tu correo con el siguiente formato: ejemplo@dominio.com";
};

export const ToGetAddress = async (nroCell) => {
  await sendWhatsappMsg(
    sendText(
      nroCell,
      "¡Perfecto! Por favor, proporciona la dirección de entrega, ejemplo: Av. Javier Prado 1234, San Isidro"
    )
  );
  return "¡Perfecto! Por favor, proporciona la dirección de entrega, ejemplo: Av. Javier Prado 1234, San Isidro";
};

export const ToCompleteInfo = async (nroCell) => {
  await sendWhatsappMsg(sendText(nroCell, "Tienes datos por definir"));
  return "Tienes datos por definir";
};

export const ToFixInfo = async (nroCell) => {
  await sendWhatsappMsg(
    sendButtonText(nroCell, {
      bodyText: "¿Qué dato deseas actualizar?",
      listBtns: [
        { id: "nro-dni", text: "Dni" },
        { id: "fecha-nacimiento", text: "Fecha de Nacimiento" },
        { id: "correo", text: "Correo" },
      ],
    })
  );
  return "¿Qué dato deseas actualizar?";
};

export const ToSureBuy = async (nroCell) => {
  await sendWhatsappMsg(
    sendButtonText(nroCell, {
      bodyText: `Bien!!🙌, ahora puedes comprar nuestro producto\n¿Deseas comprar?`,
      listBtns: [
        { id: "comprar-si", text: "Si, comprar!" },
        { id: "comprar-no", text: "No, gracias" },
      ],
    })
  );
  return "Bien!!🙌, ahora puedes comprar nuestro producto\n¿Deseas comprar?";
};

export const ToOrderDone = async (nroCell) => {
  await sendWhatsappMsg(
    sendText(
      nroCell,
      "Orden realizada!, ahora te enviaremos un link de pago para que puedas realizar la compra. Una vez que hayas realizado el pago, te enviaremos un mensaje de confirmación con la fecha de entrega. ¡Gracias!"
    )
  );
  return "Orden realizada!, ahora te enviaremos un link de pago para que puedas realizar la compra. Una vez que hayas realizado el pago, te enviaremos un mensaje de confirmación con la fecha de entrega.¡Gracias!";
};

export const VerifyOrder = async (nroCell) => {
  await sendWhatsappMsg(sendText(nroCell, "Aun tienes una orden pendiente"));
  return "Aun tienes una orden pendiente";
};

export const FinishFlow = async (nroCell) => {
  await sendWhatsappMsg(sendText(nroCell, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
  return "Gracias por tu tiempo, ¡esperamos verte pronto!";
};

export const ValidateMessage = async (nroCell, message) => {
  await sendWhatsappMsg(sendText(nroCell, message));
  return message;
};
