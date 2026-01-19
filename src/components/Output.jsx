// src/components/Output.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../hooks/mediaQuery";
import { useTheme } from "../context/ThemeContext";

// Dimensions for desktop terminal
const OUTPUT_CARD_WIDTH = "400px";
const OUTPUT_CARD_HEIGHT = "300px";

const Output = ({ output = {}, isError, showOutput, toggleTerminal }) => {
  const { theme } = useTheme();

  const outputText = isError
    ? output.stderr || output.compile_output || "An error occurred during execution."
    : output.stdout || "No output yet. Run your code!";

  const outputColor = isError
    ? "text-red-400"
    : theme === "dark"
      ? "text-dark-text-secondary"
      : "text-gray-700";

  const isLargeScreen = useMediaQuery("(min-width: 640px)");

  const mobileVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  const desktopVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <AnimatePresence>
      {showOutput && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={isLargeScreen ? desktopVariants : mobileVariants}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          style={{
            "--output-width": OUTPUT_CARD_WIDTH,
            "--output-height": OUTPUT_CARD_HEIGHT,
          }}
          className={`fixed bottom-0 left-0 right-0 z-50 w-full h-[50vh] max-h-[80vh]
            flex flex-col text-sm font-mono shadow-2xl border-t rounded-t-lg
            sm:bottom-4 sm:right-4 sm:left-auto sm:w-[var(--output-width)]
            sm:h-[var(--output-height)] sm:border sm:rounded-lg
            ${
              theme === "dark"
                ? "bg-dark-background-secondary border-dark-border-primary"
                : "bg-gray-100 border-gray-300"
            }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-3 border-b
              ${
                theme === "dark"
                  ? "bg-dark-background-primary border-dark-border-primary"
                  : "bg-gray-200 border-gray-300"
              }`}
          >
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-dark-accent-green" : "text-green-600"
              }`}
            >
              Terminal Output
            </h3>

            <button
              onClick={() => toggleTerminal(false)}
              aria-label="Close Terminal"
              className={`transition-colors duration-200
                ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
            >
              ✕
            </button>
          </div>

          {/* Output Body */}
          <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
            <pre className={`${outputColor} whitespace-pre-wrap`}>
              {outputText}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Output;
