import XLSX from "xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateUniqueFilename = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, -5);

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `export_${timestamp}_${random}.xlsx`;
};

const flattenObject = (obj, prefix = "") => {
  let flattened = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        flattened[newKey] = obj[key].join(", ");
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  return flattened;
};

export const convertToExcel = async (req, res) => {
  try {
    const { data, filename } = req.body;

    if (!data) {
      return res.status(400).json({
        error: "Data is required",
        message: "Please provide JSON data to convert to Excel.",
      });
    }

    let processedData = Array.isArray(data) ? data : [data];

    if (processedData.length === 0) {
      return res.status(400).json({
        error: "Empty data",
        message: "Data array cannot be empty.",
      });
    }

    const flattenedData = processedData.map((item) => flattenObject(item));

    if (
      flattenedData.length === 0 ||
      Object.keys(flattenedData[0] || {}).length === 0
    ) {
      return res.status(400).json({
        error: "Invalid data structure",
        message: "Unable to process the provided data.",
      });
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  
    if (worksheet["!ref"]) {
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      worksheet["!cols"] = [];

      for (let col = range.s.c; col <= range.e.c; col++) {
        worksheet["!cols"][col] = { width: 15 };
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const outputDir = path.resolve(__dirname, "..", "exports");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueFilename = filename
      ? `${filename}.xlsx`
      : generateUniqueFilename();
    const outputPath = path.join(outputDir, uniqueFilename);

    // Write Excel file with error handling
    try {
      XLSX.writeFile(workbook, outputPath);
    } catch (writeError) {
      console.error("Failed to write Excel file:", writeError);
      return res.status(500).json({
        error: "Failed to create Excel file",
        message: writeError.message,
      });
    }

    // Verify file was created and has content
    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({
        error: "File creation failed",
        message: "Excel file was not created successfully.",
      });
    }

    const fileStats = fs.statSync(outputPath);
    if (fileStats.size === 0) {
      return res.status(500).json({
        error: "File creation failed",
        message: "Excel file is empty.",
      });
    }

    console.log(
      `Excel file created successfully at: ${outputPath} (${fileStats.size} bytes)`
    );

    // Return success response
    res.json({
      success: true,
      message: "Excel file created successfully",
      filename: uniqueFilename,
      downloadUrl: `/api/excel/download/${uniqueFilename}`,
      recordCount: flattenedData.length,
      columns: Object.keys(flattenedData[0] || {}),
      fileSize: fileStats.size,
    });
  } catch (error) {
    console.error("Excel conversion error:", error);
    res.status(500).json({
      error: "Excel conversion failed",
      message: error.message,
    });
  }
};

export const downloadExcel = async (req, res) => {
  try {
    const { filename } = req.params;

    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\") ||
      !filename.endsWith(".xlsx")
    ) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const outputDir = path.resolve(__dirname, "..", "exports");
    const filePath = path.join(outputDir, filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set security headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'self'");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Download failed" });
  }
};

export const cleanupFiles = async (req, res) => {
  try {
    const outputDir = path.join(__dirname, "..", "exports");

    if (!fs.existsSync(outputDir)) {
      return res.json({ message: "No files to cleanup" });
    }

    const files = fs.readdirSync(outputDir);
    let deletedCount = 0;

    files.forEach((file) => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const now = new Date();
      const fileAge = now - stats.mtime;

      if (fileAge > 3600000) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} old files`,
      deletedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ error: "Cleanup failed" });
  }
};
