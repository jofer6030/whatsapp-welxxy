import WhatsAppService from '../services/whatsapp.service.js'

class WhatsAppController {
  #whatsAppService;

  constructor(whatsAppService) {
    this.#whatsAppService = whatsAppService
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
