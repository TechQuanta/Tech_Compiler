// src/components/Output.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMediaQuery from '../hooks/mediaQuery'; // Import the hook
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook

// Define dimensions for the output card on larger screens
const OUTPUT_CARD_WIDTH = '400px';
const OUTPUT_CARD_HEIGHT = '300px'; // You can adjust this height

const Output = ({ output, isError, showOutput, toggleTerminal }) => {
  const { theme } = useTheme(); // Get the current theme

  const outputText = isError
    ? (output.stderr || output.compile_output || 'An error occurred during execution.')
    : (output.stdout || 'No output yet. Run your code!');

  // Adjust output text color based on error and theme
  const outputColor = isError
    ? 'text-red-400' // Still red for errors
    : (theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-700'); // Muted text for dark, darker for light

  // Use the media query hook to check for 'sm' breakpoint (640px)
  const isLargeScreen = useMediaQuery('(min-width: 640px)');

  // Define animation variants based on screen size
  const mobileVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  };

  const desktopVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  };

  const currentVariants = isLargeScreen ? desktopVariants : mobileVariants;

  return (
    <AnimatePresence>
      {showOutput && (
        <motion.div
          // Responsive positioning and styling using Tailwind CSS classes
          // Default (mobile): fixed at bottom, full width
          // sm: (large screens): fixed bottom-4 right-4, specific width/height
          // Using theme-dependent classes for backgrounds, borders, and text
          className={`fixed bottom-0 left-0 right-0 w-full h-[50vh] max-h-[80vh] border-t text-sm font-mono shadow-2xl z-50 flex flex-col rounded-t-lg
                      sm:bottom-4 sm:right-4 sm:left-auto sm:w-[var(--output-width)] sm:h-[var(--output-height)] sm:border sm:rounded-lg
                      ${theme === 'dark'
                        ? 'bg-dark-background-secondary border-dark-border-primary' // Dark theme's slightly lighter background
                        : 'bg-gray-100 border-gray-300' // A light gray for the light theme
                      }`}
          style={{
            '--output-width': OUTPUT_CARD_WIDTH, // Use CSS variables for responsiveness
            '--output-height': OUTPUT_CARD_HEIGHT, // Use CSS variables for responsiveness
          }}
          // Apply dynamic variants
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={currentVariants}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }} // Smooth spring animation
        >
          {/* Header for the output card */}
          <div className={`flex items-center justify-between p-3 border-b
                          ${theme === 'dark'
                            ? 'bg-dark-background-primary border-dark-border-primary' // Header background a bit darker, matching TopBar
                            : 'bg-gray-200 border-gray-300' // Header background for light theme
                          }`}>
            <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-dark-accent-green' : 'text-green-600'}`}>
              Terminal Output
            </h3>
            <button
              onClick={() => toggleTerminal(false)}
              className={`transition-colors duration-200 focus:outline-none
                          ${theme === 'dark' ? 'text-gray-400 hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-800'}`}
              aria-label="Close Terminal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          {/* Output content area */}
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