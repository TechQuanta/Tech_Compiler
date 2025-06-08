// components/TopBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiTerminal } from 'react-icons/fi';

const TopBar = () => {
  const { theme } = useTheme();

  // Define colors for the animation dots based on theme
  const dotColors = {
    light: {
      dot1: '#32CD32', // Green
      dot2: '#6A5ACD', // Blue
      dot3: '#9370DB', // Purple
    },
    dark: {
      dot1: '#6EE7B7', // Light green, adjusted for the dark theme's accent (e.g., #2ECC71 or a lighter shade derived from it)
      dot2: '#818CF8', // Light blue, adjusted for the dark theme's accent (e.g., #00BFFF or a lighter shade)
      dot3: '#C4B5FD', // Light purple, adjusted for the dark theme's accent (e.g., #8E44AD or a lighter shade)
    },
  };

  const currentDotColors = dotColors[theme];

  return (
    <header className=" w-full h-[20px] md:h-[40px] flex items-center justify-between px-2 md:px-4 z-50 border-b
                         bg-light-background-primary border-light-border-primary text-light-text-primary
                         dark:bg-dark-background-primary dark:border-dark-border-primary dark:text-dark-text-primary">
      {/* Left: Branding Icon and Decorative three dots */}
      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Branding Icon (e.g., Terminal) */}
        <FiTerminal className={`w-4 h-4 md:w-6 md:h-6 ${theme === 'dark' ? 'text-dark-accent-green' : 'text-light-accent-green'}`} />

        {/* Decorative dots - now theme-adaptable */}
        <motion.span
          className="block w-2 h-2 md:w-3 md:h-3 rounded-full"
          style={{ backgroundColor: currentDotColors.dot1 }}
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0
          }}
        ></motion.span>
        <motion.span
          className="block w-2 h-2 md:w-3 md:h-3 rounded-full"
          style={{ backgroundColor: currentDotColors.dot2 }}
          animate={{ y: [0, 3, 0] }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.2
          }}
        ></motion.span>
        <motion.span
          className="block w-2 h-2 md:w-3 md:h-3 rounded-full"
          style={{ backgroundColor: currentDotColors.dot3 }}
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.4
          }}
        ></motion.span>
      </div>

      {/* Center: App Title */}
      <span className="font-heading font-extrabold text-xs sm:text-sm md:text-lg tracking-wider
                         text-light-text-secondary drop-shadow-[0_0_4px_var(--light-accent-blue)] md:drop-shadow-[0_0_6px_var(--light-accent-blue)]
                         dark:text-dark-text-secondary dark:drop-shadow-[0_0_4px_var(--dark-accent-blue)] dark:md:drop-shadow-[0_0_6px_var(--dark-accent-blue)]
                         truncate max-w-[calc(100%-100px)] md:max-w-none transform hover:scale-105 transition-transform duration-300">
        Connect to Shailendra !
      </span>

      {/* Right: Empty for minimalism / Future use */}
      <div className="w-4 md:w-6"></div>
    </header>
  );
};

export default TopBar;