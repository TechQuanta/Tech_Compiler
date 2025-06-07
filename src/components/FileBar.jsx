// components/FileBar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languageOptions } from "./constant"; // Assuming languageOptions is defined here
import { useTheme } from "../hooks/ThemeContext";

import { FiPlus, FiPlay, FiChevronDown } from "react-icons/fi";

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
  onVersionSelect,
}) => {
  const { theme } = useTheme();

  const getLanguageVersions = (langValue) => {
    const lang = Object.values(languageOptions).find(
      (opt) => opt.value === langValue
    );
    return lang && lang.versions ? lang.versions : lang ? [lang.version] : [];
  };

  const [version, setVersion] = useState(() => {
    const initialLang = languageOptions[language];
    return initialLang ? initialLang.version : "";
  });

  useEffect(() => {
    const currentLangOption = Object.values(languageOptions).find(
      (opt) => opt.value === language
    );
    if (currentLangOption) {
      setVersion(currentLangOption.version);
      onVersionSelect(currentLangOption.version);
    } else {
      setVersion("");
      onVersionSelect("");
    }
  }, [language, onVersionSelect]);

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
    onVersionSelect(e.target.value);
  };

  return (
    <nav
      className="fixed top-[20px] md:top-[40px] left-0 w-full h-[50px] md:h-[50px] flex items-center justify-between px-2 md:px-4 z-40 shadow-xl border-b
                     bg-light-background-secondary text-light-text-primary border-light-border-primary
                     dark:bg-dark-background-secondary dark:text-dark-text-primary dark:border-dark-border-primary"
    >
      {/* File Tabs Section */}
      <div className="flex flex-grow overflow-x-auto whitespace-nowrap custom-scrollbar-hide pr-2 md:pr-4">
        <AnimatePresence mode="popLayout">
          {openFiles.map((file) => (
            <motion.button
              key={file.id}
              layout="position"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 50,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              onClick={() => onFileSelect(file.id)}
              title={file.name}
              className={`flex items-center px-3 py-1 md:px-4 md:py-1.5 mr-1 md:mr-2 rounded-t-lg text-xs md:text-sm transition-colors duration-200 group relative z-10
                ${
                  activeFileId === file.id
                    ? "bg-light-accent-blue text-light-text-primary shadow-md shadow-light-accent-blue/40 font-semibold"
                    : "bg-light-input-bg text-light-text-secondary hover:bg-light-background-secondary hover:text-light-text-primary hover:shadow-sm hover:shadow-light-input-bg/20"
                }
                dark:${
                  activeFileId === file.id
                    ? "dark:bg-dark-accent-blue dark:text-dark-text-primary dark:shadow-dark-accent-blue/40 dark:font-semibold"
                    : "dark:bg-dark-input-bg dark:text-dark-text-secondary dark:hover:bg-dark-background-secondary dark:hover:text-dark-text-primary dark:hover:shadow-sm dark:shadow-dark-input-bg/20"
                }`}
            >
              <span className="truncate max-w-[80px] md:max-w-[120px]">
                {file.name}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClose(file.id);
                }}
                className="ml-1 md:ml-2 text-light-text-secondary hover:text-light-accent-pink
                           dark:text-dark-text-secondary dark:hover:text-dark-accent-pink
                           text-xs font-bold leading-none focus:outline-none transition-colors duration-200"
                aria-label={`Close ${file.name} `}
              >
                &times;
              </span>
              {activeFileId === file.id && (
                <motion.div
                  layoutId="active-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent-green dark:bg-dark-accent-green rounded-t-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
        {/* Button to add a new file tab with icon */}
        <button
          onClick={onNewFile}
          className="flex-shrink-0 px-2 py-1 md:px-3 md:py-1.5 rounded-t-lg text-xs md:text-sm transition-colors duration-200 shadow-sm
                       bg-light-accent-purple text-white hover:bg-light-accent-purple/80 hover:shadow-light-accent-purple/30
                       dark:bg-dark-accent-purple dark:text-dark-text-primary dark:hover:bg-dark-accent-purple/80 dark:hover:shadow-dark-accent-purple/30 flex items-center gap-1"
          aria-label="New file"
        >
          <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden md:inline">New File</span>
        </button>
      </div>

      {/* Compiler Controls Section */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Run Code Button with icon */}
        <button
          onClick={onRunCode}
          disabled={isLoading}
          className={`
            px-3 py-1 md:px-5 md:py-2 rounded-md font-semibold text-xs md:text-base transition-all duration-200 focus:outline-none focus:ring-2 shadow-md hover:shadow-lg flex items-center gap-1 bg-light-accent-green text-light-text-primary hover:bg-light-accent-green/80 focus:ring-light-accent-green focus:ring-opacity-70 hover:shadow-light-accent-green/40
            dark:bg-dark-accent-green dark:text-dark-text-primary dark:hover:bg-dark-accent-green/80 dark:focus:ring-dark-accent-green dark:focus:ring-opacity-70 dark:hover:shadow-dark-accent-green/40  
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
            `}
        >
          {isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "linear", repeat: Infinity }}
              className="inline-block"
            >
              <FiPlay className="w-4 h-4 md:w-5 md:h-5" />
            </motion.span>
          ) : (
            <>
              <FiPlay className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline">Run Code</span>
            </>
          )}
        </button>

        {/* Language Dropdown */}
        <div className="relative inline-block">
          <select
            value={language}
            onChange={(e) => onLanguageSelect(e.target.value)}
            className="rounded-md pl-2 pr-6 py-1 md:px-3 md:py-2 text-xs md:text-sm appearance-none focus:outline-none focus:ring-2 cursor-pointer shadow-sm
                         bg-light-input-bg text-light-text-primary focus:ring-light-accent-blue focus:ring-opacity-70
                         dark:bg-dark-input-bg dark:text-dark-text-primary dark:focus:ring-dark-accent-blue dark:focus:ring-opacity-70"
          >
            {Object.values(languageOptions).map((lang) => (
              <option key={lang.id} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
            ${theme === "dark" ? "text-dark-accent-purple" : "text-gray-600"}`}
          />
        </div>

        {/* Version Dropdown */}
        <div className="relative inline-block">
          <select
            value={version}
            onChange={handleVersionChange}
            disabled={
              !getLanguageVersions(language) ||
              getLanguageVersions(language).length === 0
            }
            className="rounded-md pl-2 pr-6 py-1 md:px-3 md:py-2 text-xs md:text-sm appearance-none focus:outline-none focus:ring-2 cursor-pointer shadow-sm
                         bg-light-input-bg text-light-text-primary focus:ring-light-accent-blue focus:ring-opacity-70
                         dark:bg-dark-input-bg dark:text-dark-text-primary dark:focus:ring-dark-accent-blue dark:focus:ring-opacity-70"
          >
            {getLanguageVersions(language).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
            {(!getLanguageVersions(language) ||
              getLanguageVersions(language).length === 0) && (
              <option value="">N/A</option>
            )}
          </select>
          <FiChevronDown
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
            ${theme === "dark" ? "text-dark-accent-purple" : "text-gray-600"}`}
          />
        </div>
      </div>
    </nav>
  );
};

export default FileBar;
