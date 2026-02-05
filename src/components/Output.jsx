import { FiX, FiTerminal, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Output = ({ output, isError, showOutput, isLoading, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!showOutput) return null;

  return (
    <div className={`h-[35%] flex flex-col border-t z-10 transition-colors
      ${isDark 
        ? "bg-[#1e1e1e] border-[#333] text-gray-300" 
        : "bg-white border-gray-300 text-gray-800"}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-semibold uppercase tracking-wider
        ${isDark ? "bg-[#252526] border-[#333]" : "bg-gray-100 border-gray-200"}`}>
        
        <div className="flex items-center gap-2">
          <FiTerminal className={isError ? "text-red-500" : "text-blue-500"} />
          <span>Console Output</span>
          {isLoading && <span className="text-yellow-500 normal-case ml-2 animate-pulse">Running...</span>}
        </div>

        <button 
          onClick={onClose} 
          className="p-1 hover:bg-gray-500/20 rounded-md transition-colors"
          title="Close Terminal"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="flex-grow overflow-auto p-4 font-mono text-sm">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50">
             <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p>Compiling execution environment...</p>
          </div>
        ) : output ? (
          <div>
            <div className={`mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
              ${isError 
                ? "bg-red-500/10 text-red-500 border-red-500/20" 
                : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
              {isError ? <FiAlertCircle /> : <FiCheckCircle />}
              {isError ? "Execution Failed" : "Execution Successful"}
            </div>

            <pre className="whitespace-pre-wrap break-words leading-relaxed">
              {output.stdout || output.stderr || output.compile_output || <span className="text-gray-500 italic">No output returned.</span>}
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 italic">
            Press "Run Code" to see the output here.
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;