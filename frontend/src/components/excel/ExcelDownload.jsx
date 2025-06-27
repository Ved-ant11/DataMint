import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

export default function ExcelDownload({ jsonData }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await api.post("/excel/convert", {
        data: jsonData,
        filename: "generated-data",
      });

      const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}${
        response.data.downloadUrl
      }`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", response.data.filename);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleDownload}
        className="btn-secondary relative overflow-hidden"
        disabled={loading || success}
      >
        {loading ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mr-2"
            >
              ⏳
            </motion.span>
            Preparing...
          </motion.span>
        ) : success ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                transition: { repeat: 2, duration: 0.4 },
              }}
              className="mr-2"
            >
              ✅
            </motion.span>
            Download Complete!
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mr-2"
            >
              📥
            </motion.span>
            Download Excel
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}
