import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import {sanitizeText} from "../utils/sanitizeText.util.js"

import {
  sendButtonText,
  sendButtonDocument,
  sendButtonImage,
  sendText,
} from "../shared/msgWhatssapModels.shared.js";


const user = {
  isNew: false,
  data: {
    tel: "51961324952",
    name: "José Fernando",
    lastname: "Velasque Echebautis",
    dni: "74885854",
    address: "Jr. 28 de Julio N°2364",
  },
};

export const wellxxyCompra = async (infoText, number, name) => {
  console.log('Client:',infoText.text)
  const textLower = sanitizeText(infoText.text);
  console.log('Client:',textLower)
  switch (true) {
    case textLower === "hola":
      await sendWhatsappMsg(
        sendButtonImage(number, {
          image:
            "https://th.bing.com/th/id/OIP.AfU6ELNHUNbAUlnss1CPwQHaHa?pid=ImgDet&rs=1",
          bodyText: `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`,
          listBtns: [{ id: "comprar-producto", text: "Comprar producto" }],
        })
      );
      break;
    case textLower === "comprar producto" &&
      infoText.id === "btn-comprar-producto":
      if (user.isNew) {
        await sendWhatsappMsg(
          sendButtonDocument(number, {
            document:
              "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
            filename: "Términos y condiciones",
            bodyText: "¿Aceptas nuestros términos y condiciones?",
            listBtns: [
              { id: "terminos-si", text: "✅Si" },
              { id: "terminos-no", text: "❌No" },
            ],
          })
        );
      } else {
        await sendWhatsappMsg(
          sendButtonText(number, {
            bodyText:
              "¿Tus datos son correctos?\n*N°Tel:* 51961324952,\n*Nombres:* José Fernando,\n*Apellidos:* Velasque Echebautis,\n*Dni:* 74885854,\n*Dirección:* Jr. 28 de Julio N°2364",
            listBtns: [
              { id: "info-correct-si", text: "✅Si" },
              { id: "info-correct-no", text: "❌No" },
            ],
          })
        );
      }
      break;
    case textLower === "no" && infoText.id === "btn-info-correct-no":
      await sendWhatsappMsg(sendText(number, "Actualiza tus datos"));
      break;
  }
};
