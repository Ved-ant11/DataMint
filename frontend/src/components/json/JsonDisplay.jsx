import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

export default function JsonDisplay({ jsonData }) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const displayRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      ref={displayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-800/70 hover:bg-gray-700/80 text-gray-300 px-3 py-1 rounded text-sm transition-colors flex items-center"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center"
            >
              <Check className="w-4 h-4 mr-1" /> Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center"
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        customStyle={{
          background: "transparent",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          maxHeight: "400px",
          margin: 0,
        }}
        wrapLongLines
      >
        {JSON.stringify(jsonData, null, 2)}
      </SyntaxHighlighter>
    </motion.div>
  );
}
