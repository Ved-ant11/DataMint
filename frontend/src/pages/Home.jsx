import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Driven Data Generation",
    desc: "Instantly create realistic, structured JSON datasets from simple prompts. No manual coding, no time wasted.",
    icon: "⚡",
  },
  {
    title: "One-Click Excel Export",
    desc: "Transform any dataset into a polished Excel file in seconds. Share with teams, clients, or stakeholders effortlessly.",
    icon: "📈",
  },
  {
    title: "Enterprise-Ready Templates",
    desc: "Choose from a curated library of business templates—user profiles, products, HR, finance, and more.",
    icon: "🏢",
  },
  {
    title: "Secure & Private",
    desc: "Your data never leaves your control. Authenticated, encrypted, and privacy-first by design.",
    icon: "🔒",
  },
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto text-center py-20"
    >
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        DataMint
      </motion.h1>
      <motion.p
        className="text-2xl text-gray-200 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Supercharge your workflow.
        <br />
        <span className="text-primary-400 font-semibold">
          Generate, validate, and export data at lightning speed.
        </span>
      </motion.p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 32px #0003" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-200 text-lg">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10"
      >
        <a
          href = "/login"
          className="inline-block px-8 py-4 bg-primary-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
        >
          Try DataMint Now &rarr;
        </a>
        <p className="mt-4 text-gray-400 text-sm">
          No credit card required. Start generating data in under 60 seconds.
        </p>
      </motion.div>
    </motion.div>
  );
}
