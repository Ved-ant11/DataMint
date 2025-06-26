import express from "express";
import {
  generateBasicJSON,
  getTemplates,
  generateAIJSON,
  validateJSON,
  testAI,
} from "../controllers/jsonController.js";
const router = express.Router();

router.post("/generate", generateBasicJSON);
router.get("/templates", getTemplates);
router.post("/generate-ai", generateAIJSON);
router.post("/validate", validateJSON);
router.post("/test-ai", testAI);

export default router;
