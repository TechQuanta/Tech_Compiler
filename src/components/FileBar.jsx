import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPlus, FiX, FiSettings, FiLoader } from "react-icons/fi";
import { languageOptions } from "../utils/constant";
import { useTheme } from "../context/ThemeContext";

const FileBar = ({
  language,
  onLanguageSelect,
  onRunCode,
  isLoading,
  openFiles,
  activeFileId,
  onFileSelect,
  onFileClose,
  onNewFile,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`h-12 flex items-center justify-between px-4 border-b select-none
      ${isDark ? "bg-[#1e1e1e] border-[#333]" : "bg-gray-100 border-gray-300"}`}>
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar mask-gradient-right">
        <AnimatePresence>
          {openFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, width: 0 }}
              onClick={() => onFileSelect(file.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer transition-colors text-sm border-t border-l border-r border-transparent
                ${
                  activeFileId === file.id
                    ? isDark 
                      ? "bg-[#2d2d2d] text-white border-[#333]" 
                      : "bg-white text-blue-600 border-gray-300 shadow-sm"
                    : "text-gray-500 hover:bg-opacity-10 hover:bg-gray-500"
                }`}
            >
              <span className="max-w-[100px] truncate">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onFileClose(file.id); }}
                className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-all`}
              >
                <FiX size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <button 
          onClick={onNewFile}
          className="p-1.5 ml-1 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
          title="New File"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <select
            value={language}
            onChange={(e) => onLanguageSelect && onLanguageSelect(e.target.value)}
            className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-md border outline-none cursor-pointer transition-all
              ${isDark 
                ? "bg-[#2d2d2d] border-[#444] text-gray-300 hover:border-gray-500 focus:border-blue-500" 
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"}`}
          >
            {Object.values(languageOptions).map((lang) => (
              <option key={lang.id} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <FiSettings className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
        </div>

        <button
          onClick={onRunCode}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95
            ${isLoading 
              ? "bg-gray-600 cursor-wait opacity-80" 
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-green-500/20"}`}
        >
          {isLoading ? <FiLoader className="animate-spin" size={14}/> : <FiPlay size={14} fill="currentColor" />}
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>
    </div>
  );
};

export default FileBar;