import WhatsAppService from '../services/whatsapp.service.js'

class WhatsAppController {
  #whatsAppService;

  constructor() {
    this.#whatsAppService = new WhatsAppService()
  }

  verifyToken = async(req, res, next) => {
    try {
      await this.#whatsAppService.verifyToken(req, res);
    } catch (error) {
      next(error);
    }
  }

  recievedMessage = async(req, res, next) => {
    try {
      await this.#whatsAppService.recievedMessage(req, res);
    } catch (error) {
      next(error);
    }
  }
}

export default WhatsAppController;
