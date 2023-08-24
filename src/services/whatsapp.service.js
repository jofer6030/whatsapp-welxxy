import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";

import { sendText } from "../shared/msgWhatssapModels.shared.js";
import { wellxxyCompra } from "../flows/wellxxy-compra.js";

class WhatsAppService {
  constructor() {}

  async verifyToken(req, res) {
    const accessToken = "WsV3rify";
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (challenge !== null && token !== null && token === accessToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(400);
    }
  }

  async recievedMessage(req, res) {
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const messageObject = value["messages"];

    if (typeof messageObject !== "undefined") {
      const messages = messageObject[0];
      const text = this.#getTextUser(messages);
      const number = messages["from"];

      await wellxxyCompra(text, number);
    }

    res.send("RecievedMessage");
  }

  #getTextUser(messages) {
    let text = "";
    const typeMessage = messages["type"];

    if (typeMessage === "text") {
      text = messages["text"].body;
    }

    if (typeMessage === "interactive") {
      const interactiveObject = messages["interactive"];
      const typeInteractive = interactiveObject["type"];
      if (["button_reply", "list_reply"].includes(typeInteractive)) {
        text = interactiveObject[typeInteractive].title;
      }
    }

    return text;
  }
}

export default WhatsAppService;
