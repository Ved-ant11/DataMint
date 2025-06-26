import express from "express";
import {
  convertToExcel,
  downloadExcel,
  cleanupFiles,
} from "../controllers/excelController.js";

const router = express.Router();

router.post("/convert", convertToExcel);
router.get("/download/:filename", downloadExcel);
router.delete("/cleanup", cleanupFiles);

export default router;
