import { sendWhatsappMsg } from "../utils/sendWhatsappMsg.util.js";

import { sendText } from "../shared/msgWhatssapModels.shared.js";
import { wellxxyCompra } from "../flows/wellxxy-compra.js";

class WhatsAppService {
  constructor() { }

  async verifyToken(req, res) {
    const accessToken = "testT0ken";
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
    const contact = value["contacts"];
    console.log(JSON.stringify(entry, null, '\t'));

    if (typeof messageObject !== "undefined") {
      const messages = messageObject[0];
      const name = contact[0].profile.name;
      const userPhoneNumber = messages["from"];
      const infoText = this.#getInfoTextUser(messages);
      // console.log(JSON.stringify(entry, null, '\t'));
      // wellxxyCompra(infoText, userPhoneNumber, name);
    }
    res.sendStatus(200);
  }

  #getInfoTextUser(messages) {
    const infoText = { text: "" };
    const typeMessage = messages["type"];

    if (typeMessage === "text") {
      infoText.text = messages["text"].body;
    }

    if (typeMessage === "interactive") {
      const interactiveObject = messages["interactive"];
      const typeInteractive = interactiveObject["type"];
      if (["button_reply", "list_reply"].includes(typeInteractive)) {
        infoText.text = interactiveObject[typeInteractive].title;
        infoText.id = interactiveObject[typeInteractive].id;
      }
    }

    return infoText;
  }
}

export default WhatsAppService;
