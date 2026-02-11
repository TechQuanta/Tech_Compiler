import { motion } from "framer-motion";
import { FiTerminal, FiShare2, FiUsers } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const TopBar = ({ onShare, onCollaborate }) => {
  const { theme } = useTheme();

  const dotColors = {
    light: { dot1: "#32CD32", dot2: "#6A5ACD", dot3: "#9370DB" },
    dark: { dot1: "#6EE7B7", dot2: "#818CF8", dot3: "#C4B5FD" },
  };

  const colors = dotColors[theme] || dotColors.dark;

  return (
    <header
      className="w-full h-[20px] md:h-[40px] flex items-center justify-between
                 px-2 md:px-4 z-30 border-b relative
                 bg-light-background-primary border-light-border-primary text-light-text-primary
                 dark:bg-dark-background-primary dark:border-dark-border-primary dark:text-dark-text-primary"
    >
      {/* Left: Icon + animated dots */}
      <div className="flex items-center space-x-1 md:space-x-3">
        <FiTerminal
          className={`w-4 h-4 md:w-6 md:h-6 ${
            theme === "dark" ? "text-dark-accent-green" : "text-light-accent-green"
          }`}
        />

        {[colors.dot1, colors.dot2, colors.dot3].map((color, index) => (
          <motion.span
            key={index}
            className="block w-2 h-2 md:w-3 md:h-3 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ y: index % 2 === 0 ? [0, -3, 0] : [0, 3, 0] }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Center: Title */}
      <span
        className="font-heading font-extrabold text-xs sm:text-sm md:text-lg tracking-wider
                   truncate max-w-[calc(100%-120px)] md:max-w-none
                   text-light-text-secondary
                   drop-shadow-[0_0_4px_var(--light-accent-blue)]
                   dark:text-dark-text-secondary
                   dark:drop-shadow-[0_0_4px_var(--dark-accent-blue)]
                   transform hover:scale-105 transition-transform duration-300"
      >
        Online Code Compiler
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={onCollaborate}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs md:text-sm font-medium transition-colors border
             ${theme === 'dark' 
                ? 'bg-transparent border-gray-600 hover:bg-white/10 text-gray-300' 
                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
        >
          <FiUsers className="hidden md:block" />
          <span>Collaborate</span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white
                     px-3 py-1 rounded text-xs md:text-sm
                     transition-colors duration-200 shadow-lg shadow-blue-500/20"
        >
          <FiShare2 className="hidden md:block" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;