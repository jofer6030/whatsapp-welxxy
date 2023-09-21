import ApiService from "../services/api.service.js";
import { sendButtonText, sendButtonDocument, sendButtonImage, sendText } from "../shared/msgWhatssapModels.shared.js";

import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";
import { sanitizeText } from "../utils/sanitizeText.util.js";
import { isDateValid, isFormatDateValid } from "../utils/isDateValid.util.js";
import { isEmailValid } from "../utils/isEmailValid.util.js";

const user = {
  isNew: true,
  data: {
    tel: "5112345678",
    dni: "12345678",
    fechaNacimiento: "01-01-1990",
  },
};

const apiService = new ApiService();

const verifyUser = (user) => ({
  bodyText: `*¿Tus datos son correctos?*\n\n*N°Tel:* ${user.nro_celular || "por definir"}\n*Dni:* ${user.dni || "por definir"
    }\n*Fecha de Nacimiento:* ${user.fecha_nacimiento || "por definir"}\n*Correo:* ${user.correo || "por definir"}\n\nSi tienes algun dato *por definir*, por favor, actualizalo presionando el boton *No, actualizar*, de lo contrario no se podra continuar con la compra`,
  listBtns: [
    { id: "info-correct-si", text: "Si, correctos" },
    { id: "info-correct-no", text: "No, actualizar" },
  ],
});

export const wellxxyCompra = async (infoText, userPhoneNumber, name) => {
  const textLower = sanitizeText(infoText.text);
  if (textLower === "hola") {
    return await sendWhatsappMsg(
      sendButtonImage(userPhoneNumber, {
        image: "https://th.bing.com/th/id/OIP.AfU6ELNHUNbAUlnss1CPwQHaHa?pid=ImgDet&rs=1",
        bodyText: `¡Hola ${name}! Somos Wellxxy, un emprendimiento de salud y bienestar para la mujer.\nPor favor haga click para comenzar`,
        listBtns: [{ id: "iniciar", text: "Iniciar" }],
      })
    );
  }
  if (textLower === "iniciar" || infoText.id === "btn-iniciar") {
    let response;
    try {
      response = await apiService.getUserByTel(userPhoneNumber);
    } catch (error) {
      response = error.response.data
    }

    if (response.status === 404 && response.message.toLowerCase() === "usuario no encontrado") {
      return await sendWhatsappMsg(
        sendButtonDocument(userPhoneNumber, {
          document: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
          filename: "Términos y condiciones",
          bodyText: "¿Aceptas nuestros términos y condiciones?",
          listBtns: [
            { id: "terminos-si", text: "Si" },
            { id: "terminos-no", text: "No" },
          ],
        })
      );
    } else if (response.status === 200) {
      return await sendWhatsappMsg(sendButtonText(userPhoneNumber, verifyUser(response.user)));
    }
  }
  if (infoText.id === "btn-terminos-si") {
    await apiService.createUser({ nro_celular: userPhoneNumber });
    await sendWhatsappMsg(
      sendText(
        userPhoneNumber,
        "Para poder continuar, necesitamos algunos datos adicionales. Estos datos son necesarios para asegurarnos de brindarte el mejor servicio posible y cumplir con nuestras políticas de seguridad y privacidad. Una vez que hayas ingresado estos datos, estaremos listos para continuar. ¡Gracias!"
      )
    );
    await sendWhatsappMsg(sendText(userPhoneNumber, "Por favor, proporciona tu número de DNI, ejemplo: 12345678"));
    return;
  }
  if (infoText.id === "btn-terminos-no") {
    return await sendWhatsappMsg(sendText(userPhoneNumber, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
  }

  // DNI
  if (textLower.length === 8 && !isNaN(Number(textLower))) {
    // Crear usuario en la base de datos con el dni
    let info;
    try {
      const {data} = await apiService.getInfoByDni(textLower)
      info = data
    } catch (error) {
      console.log(error)
    }
    if (info) {
      const [apellidos,nombres] = info.nombre_completo.split(',')
      await apiService.updateUser({ number: userPhoneNumber, dni: textLower, nombres, apellidos  });
    }
    await apiService.updateUser({ number: userPhoneNumber, dni: textLower});

    return await sendWhatsappMsg(
      sendText(
        userPhoneNumber,
        "Ahora, proporciona tu fecha de nacimiento con el siguiente formato: *dd-mm-aaaa* (dia-mes-año), ejemplos: 01-01-1990"
      )
    );
  }

  // FECHA DE NACIMIENTO
  if (textLower.split("-").length === 3) {
    if (isFormatDateValid(textLower) && isDateValid(textLower)) {
      // Actualizar usuario en la base de datos con la fecha de nacimiento
      await apiService.updateUser({ number: userPhoneNumber, fecha_nacimiento: textLower });
      return await sendWhatsappMsg(
        sendText(userPhoneNumber, "Ahora, proporciona tu correo con el siguiente formato: ejemplo@dominio.com")
      );
    }
    return await sendWhatsappMsg(
      sendText(userPhoneNumber, "El formato de la fecha de nacimiento es incorrecto, por favor, vuelve a intentarlo")
    );
  }

  // EMAIL
  if (textLower.includes("@") && textLower.includes(".")) {
    if (isEmailValid(textLower)) {
      // Actualizar usuario en la base de datos con el correo
      const userUpdated = await apiService.updateUser({ number: userPhoneNumber, correo: textLower });
      return await sendWhatsappMsg(sendButtonText(userPhoneNumber, verifyUser(userUpdated.user)));
    }
    return await sendWhatsappMsg(
      sendText(userPhoneNumber, "El formato del correo es incorrecto, por favor, vuelve a intentarlo ")
    );
  }

  if (textLower === "no, actualizar" || infoText.id === "btn-info-correct-no") {
    return await sendWhatsappMsg(
      sendText(userPhoneNumber, "Actualicemos tus datos, Por favor, proporciona tu número de DNI, ejemplo: 12345678")
    );
  }
  if (textLower === "si, correctos" || infoText.id === "btn-info-correct-si") {
    const data = await apiService.getUserByTel(userPhoneNumber);
    const { user: { dni, fecha_nacimiento, correo } } = data
    if (!dni || !fecha_nacimiento || !correo) {
      await sendWhatsappMsg(sendText(userPhoneNumber, "Tienes datos por definir"))
      return await sendWhatsappMsg(sendButtonText(userPhoneNumber, verifyUser(data.user)));
    }
    return await sendWhatsappMsg(
      sendButtonText(userPhoneNumber, {
        bodyText: `Bien!!🙌, ahora puedes comprar nuestro producto\n¿Deseas comprar?`,
        listBtns: [
          { id: "comprar-si", text: "Si, comprar!" },
          { id: "comprar-no", text: "No, gracias" },
        ],
      })
    );
  }

  if (textLower === "no, gracias" || infoText.id === "btn-comprar-no") {
    return await sendWhatsappMsg(sendText(userPhoneNumber, "Gracias por tu tiempo, ¡esperamos verte pronto!"));
  }
  if (textLower === "si, comprar!" || infoText.id === "btn-comprar-si") {
    return await sendWhatsappMsg(
      sendText(
        userPhoneNumber,
        "¡Perfecto! Por favor, proporciona la dirección de entrega, ejemplo: Av. Javier Prado 1234, San Isidro"
      )
    );
  }
  if (["av.", "jr.", "psje.", "calle", "cra.", "pasaje"].some((word) => textLower.includes(word))) {
    // se envia en link de pago mercado pago
    await apiService.createOrden({ nro_celular: userPhoneNumber, direccion_envio: textLower });
    return await sendWhatsappMsg(
      sendText(
        userPhoneNumber,
        "Orden realizada!, ahora te enviaremos un link de pago para que puedas realizar la compra. Una vez que hayas realizado el pago, te enviaremos un mensaje de confirmación con la fecha de entrega. ¡Gracias!"
      )
    );
  }
};
