import { useState } from "react";
// import { LANGUAGE_VERSIONS } from "../jsFiles/constant";
import { languageOptions } from "../constant.js";

// const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_CLASSES = "text-blue-400 bg-gray-900";

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex gap-4 items-center">
      <p className="text-lg">Language:</p>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        {language}
      </button>

      {isOpen && (
        <div className="absolute top-8 left-24 h-64 mt-2 w-48 bg-[rgb(17,12,27)] border border-gray-700 rounded shadow-md z-10 overflow-auto">
          {Object.entries(languageOptions).map(([name, { version }]) => {
            const isActive = name === language;
            return (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  setIsOpen(false);
                }}
                className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-900 hover:text-blue-400 ${
                  isActive ? ACTIVE_CLASSES : "text-white"
                }`}
              >
                {name}
                <span className="text-gray-600 text-sm ml-2">({version})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
