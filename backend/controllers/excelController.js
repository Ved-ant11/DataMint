import XLSX from "xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";


// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to generate unique filename
// const generateUniqueFilename = () => {
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000);
//   return `export_${timestamp}_${random}.xlsx`;
// };

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


//Flatten nested JSON objects
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
        // Convert arrays to comma-separated strings
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

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

   
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    worksheet["!cols"] = [];

  
    for (let col = range.s.c; col <= range.e.c; col++) {
      worksheet["!cols"][col] = { width: 15 };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    
    const outputDir = path.join(__dirname, "..", "exports");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueFilename = filename
      ? `${filename}.xlsx`
      : generateUniqueFilename();
    const outputPath = path.join(outputDir, uniqueFilename);

    // Write Excel file
    XLSX.writeFile(workbook, outputPath);

    // Success response
    console.log(`Excel file created at: ${outputPath}`);
    res.json({
      success: true,
      message: "Excel file created successfully",
      filename: uniqueFilename,
      downloadUrl: `/api/excel/download/${uniqueFilename}`,
      recordCount: flattenedData.length,
      columns: Object.keys(flattenedData[0] || {}),
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
      filename.includes("\\")
    ) {
      return res.status(400).json({ error: "Invalid filename" });
    }

  
    const outputDir = path.resolve(__dirname, "..", "exports");
    const filePath = path.join(outputDir, filename);

    console.log("Looking for file at:", filePath); // Check file log
    console.log("File exists:", fs.existsSync(filePath)); // Check file log

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found",
        path: filePath,
        directory: outputDir,
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed" });
        }
      }
    });
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

     
      if (fileAge > 600000) {
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


