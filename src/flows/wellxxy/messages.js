import { sendWhatsappMsg } from "../../utils/sendWhatsappMsg.util";
import { sendButtonDocument, sendButtonImage, sendButtonText, sendText } from "../../shared/msgWhatssapModels.shared";

export const Welcome = async (nroTel, name) => {
  await sendWhatsappMsg(
    sendButtonImage(nroTel, {
      image: "https://th.bing.com/th/id/OIP.AfU6ELNHUNbAUlnss1CPwQHaHa?pid=ImgDet&rs=1",
      bodyText: `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`,
      listBtns: [{ id: "iniciar", text: "Iniciar" }],
    })
  );
};

export const TermsConditions = async (nroTel) => {
  await sendWhatsappMsg(
    sendButtonDocument(nroTel, {
      document: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
      filename: "Términos y condiciones",
      bodyText: "¿Aceptas nuestros términos y condiciones?",
      listBtns: [
        { id: "si", text: "✅Si" },
        { id: "no", text: "❌No" },
      ],
    })
  );
};

export const VerifyInfoUser = async (nroTel, user) => {
  await sendWhatsappMsg(
    sendButtonText(nroTel, {
      bodyText: `*¿Tus datos son correctos?*\n\n*N°Tel:* ${user.nro_celular || "por definir"}\n*Dni:* ${
        user.dni || "por definir"
      }\n*Fecha de Nacimiento:* ${user.fecha_nacimiento || "por definir"}\n*Correo:* ${
        user.correo || "por definir"
      }\n\nSi tienes algun dato *por definir*, por favor, actualizalo presionando el boton *No, actualizar*, de lo contrario no se podra continuar con la compra`,
      listBtns: [
        { id: "info-correct-si", text: "Si, correctos" },
        { id: "info-correct-no", text: "No, actualizar" },
      ],
    })
  );
};

export const ToGetDni = async (nroTel) => {
  await sendWhatsappMsg(
    sendText(
      nroTel,
      "Para poder continuar, necesitamos algunos datos adicionales. Estos datos son necesarios para asegurarnos de brindarte el mejor servicio posible y cumplir con nuestras políticas de seguridad y privacidad. Una vez que hayas ingresado estos datos, estaremos listos para continuar. ¡Gracias!"
    )
  );
  await sendWhatsappMsg(sendText(nroTel, "Por favor, proporciona tu número de DNI, ejemplo: 12345678"));
};

export const FinishFlow = async (nroTel) => {
  await sendWhatsappMsg(sendText(nroTel, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
};

export const ValidateMessage = async (nroTel, message) => {
  await sendWhatsappMsg(
    sendText(nroTel, `Respuesta incorrecta, por favor ingresa una respuesta válida (*${message}*)`)
  );
};
