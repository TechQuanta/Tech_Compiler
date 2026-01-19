// src/components/LanguageSelector.jsx
import { useState, useRef, useEffect } from "react";
import { languageOptions } from "../utils/constant";

const ACTIVE_CLASSES = "text-blue-400 bg-gray-900";

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex gap-3 items-center">
      <p className="text-sm md:text-base text-gray-400">Language:</p>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-1 bg-gray-800 text-white rounded
                   hover:bg-gray-700 transition"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {language}
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-9 left-20 h-64 w-48
                     bg-[rgb(17,12,27)] border border-gray-700
                     rounded shadow-lg z-50 overflow-auto"
        >
          {Object.values(languageOptions).map((lang) => {
            const isActive = lang.value === language;

            return (
              <button
                key={lang.id}
                onClick={() => {
                  onSelect(lang.value);
                  setIsOpen(false);
                }}
                className={`flex justify-between items-center w-full px-4 py-2
                            text-left transition-colors
                            hover:bg-gray-900 hover:text-blue-400
                            ${
                              isActive
                                ? ACTIVE_CLASSES
                                : "text-gray-200"
                            }`}
              >
                <span>{lang.label}</span>
                <span className="text-xs text-gray-500">
                  ({lang.version})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
