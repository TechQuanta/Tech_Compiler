// src/pages/CompilerLandingPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const CompilerLandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-center px-6
        ${
          theme === "dark"
            ? "bg-dark-background-primary text-dark-text-primary"
            : "bg-light-background-primary text-light-text-primary"
        }`}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-extrabold mb-4"
      >
        Online Code Compiler
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 max-w-xl mb-8"
      >
        Write, run, and share code instantly in your browser.  
        No setup. No login. Just code.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/editor")}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
                   bg-blue-600 hover:bg-blue-700 shadow-lg"
      >
        <FiPlay size={18} />
        Start Coding
      </motion.button>
    </div>
  );
};

export default CompilerLandingPage;