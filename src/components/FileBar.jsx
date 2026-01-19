// src/components/FileBar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languageOptions } from "../utils/constant";
import { useTheme } from "../context/ThemeContext";
import { FiPlus, FiPlay, FiChevronDown } from "react-icons/fi";

const FileBar = ({
  language,
  onLanguageSelect,
  onRunCode,
  onShare,
  isLoading,
  openFiles,
  activeFileId,
  onFileSelect,
  onFileClose,
  onNewFile,
  onVersionSelect,
}) => {
  const { theme } = useTheme();
  const [version, setVersion] = useState("");

  // Get versions for selected language
  const getLanguageVersions = (langValue) => {
    const lang = Object.values(languageOptions).find(
      (opt) => opt.value === langValue
    );
    return lang?.versions?.length ? lang.versions : lang?.version ? [lang.version] : [];
  };

  // Sync version with language
  useEffect(() => {
    const lang = Object.values(languageOptions).find(
      (opt) => opt.value === language
    );
    const v = lang?.version || "";
    setVersion(v);
    onVersionSelect(v);
  }, [language, onVersionSelect]);

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
    onVersionSelect(e.target.value);
  };

  return (
    <nav className="w-full h-[50px] flex items-center justify-between px-2 md:px-4 border-b shadow-xl
                    bg-light-background-secondary dark:bg-dark-background-secondary
                    border-light-border-primary dark:border-dark-border-primary">

      {/* ================= FILE TABS ================= */}
      <div className="flex flex-grow overflow-x-auto custom-scrollbar pr-3">
        <AnimatePresence mode="popLayout">
          {openFiles.map((file) => (
            <motion.button
              key={file.id}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => onFileSelect(file.id)}
              className={`flex items-center px-3 py-1 mr-2 rounded-t-lg text-xs md:text-sm relative
                ${
                  activeFileId === file.id
                    ? "bg-light-accent-blue dark:bg-dark-accent-blue text-white font-semibold"
                    : "bg-light-input-bg dark:bg-dark-input-bg text-gray-400 hover:text-white"
                }`}
            >
              <span className="truncate max-w-[100px]">{file.name}</span>

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClose(file.id);
                }}
                className="ml-2 text-xs font-bold hover:text-red-400"
              >
                ×
              </span>

              {activeFileId === file.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px]
                             bg-light-accent-green dark:bg-dark-accent-green"
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* New File Button */}
        <button
          onClick={onNewFile}
          className="px-2 py-1 rounded-t-lg text-xs md:text-sm
                     bg-light-accent-purple dark:bg-dark-accent-purple text-white flex items-center gap-1"
        >
          <FiPlus size={14} />
          <span className="hidden md:inline">New</span>
        </button>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Share */}

        {/* Run */}
        <button
          onClick={onRunCode}
          disabled={isLoading}
          className={`px-3 py-1 rounded-md flex items-center gap-1
                      bg-light-accent-green dark:bg-dark-accent-green text-white
                      ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <FiPlay size={14} />
          <span className="hidden md:inline">Run</span>
        </button>

        {/* Language */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageSelect(e.target.value)}
            className="pl-2 pr-6 py-1 rounded-md text-xs md:text-sm
                       bg-light-input-bg dark:bg-dark-input-bg text-white"
          >
            {Object.values(languageOptions).map((lang) => (
              <option key={lang.id} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Version */}
        <div className="relative">
          <select
            value={version}
            onChange={handleVersionChange}
            disabled={!getLanguageVersions(language).length}
            className="pl-2 pr-6 py-1 rounded-md text-xs md:text-sm
                       bg-light-input-bg dark:bg-dark-input-bg text-white"
          >
            {getLanguageVersions(language).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
            {!getLanguageVersions(language).length && <option>N/A</option>}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

      </div>
    </nav>
  );
};

export default FileBar;
