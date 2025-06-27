import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import JsonGenerator from "@/components/json/JsonGenerator";
import JsonDisplay from "@/components/json/JsonDisplay";
import ExcelDownload from "@/components/excel/ExcelDownload";

export default function Generator() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jsonDisplayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (jsonData && jsonDisplayRef.current) {
      gsap.fromTo(
        jsonDisplayRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [jsonData]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
        >
          <motion.h2
            className="text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create JSON Data
          </motion.h2>
          <JsonGenerator
            setJsonData={setJsonData}
            setLoading={setLoading}
            setError={setError}
          />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Generated Data
            </motion.h2>
            {jsonData && <ExcelDownload jsonData={jsonData} />}
          </div>

          <div ref={jsonDisplayRef}>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <motion.p
                  className="mt-4 text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Generating your data...
                </motion.p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 p-4 bg-red-900/30 rounded-lg"
              >
                Error: {error}
              </motion.div>
            ) : jsonData ? (
              <JsonDisplay jsonData={jsonData} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <p>Enter a prompt or select a template to generate data</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
