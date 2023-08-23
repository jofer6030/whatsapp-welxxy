class WhatsAppController {
  #whatsAppService;

  constructor(whatsAppService) {
    this.#whatsAppService = whatsAppService;
  }

  async verifyToken(req, res, next) {
    try {
      await this.#whatsAppService.verifyToken(req, res);
    } catch (error) {
      next(error);
    }
  }

  async recievedMessage(req, res, next) {
    try {
      await this.#whatsAppService.recievedMessage(req, res);
    } catch (error) {
      next(error);
    }
  }
}

export default WhatsAppController;
