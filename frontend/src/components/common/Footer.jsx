import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="bg-black/30 backdrop-blur-md border-t border-white/20 py-6 mt-8"
    >
      <div className="container mx-auto px-4 text-center text-gray-400 flex flex-col">
        <p>
          © {new Date().getFullYear()} DataMint. Built with React, shadcn/ui,
          GSAP, Framer Motion.
        </p>
        <a href="https://github.com/Ved-ant11" target="_blank" className="text-gray-400 hover:text-white transition-colors mt-2 inline-block text-sm">Follow me on GitHub </a>
      </div>
    </motion.footer>
  );
}
