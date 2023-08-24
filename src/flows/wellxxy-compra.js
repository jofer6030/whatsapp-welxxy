import { sendText } from "../shared/msgWhatssapModels.shared";
import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util";

export const wellxxyCompra = async (text, number) => {
  if (text === "hola") {
    await sendWhatsappMsg(sendText("Hola <name>, somos Wellxxy", number));
  }
};
