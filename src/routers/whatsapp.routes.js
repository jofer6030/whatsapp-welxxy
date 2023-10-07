import { Router } from "express";

import WhatsAppController from "../controllers/whatsapp.controller.js";
import WhatsAppService from '../services/whatsapp.service.js'

const whatsAppController = new WhatsAppController(new WhatsAppService());

const router = Router();

router
  .get("/webhook", whatsAppController.verifyToken)
  .post("/webhook", whatsAppController.recievedMessage);

export default router;
