import { Router } from "express";

import WhatsAppController from "../controllers/whatsapp.controller.js";

const whatsAppController = new WhatsAppController();

const router = Router();

router
  .get("/webhook", whatsAppController.verifyToken)
  .post("/webhook", whatsAppController.recievedMessage);

export default router;
