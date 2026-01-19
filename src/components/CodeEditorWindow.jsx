// src/components/CodeEditorWindow.jsx
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  onMount,
  className = "",
  style = {},
  activeFileId,
}) => {
  if (!activeFileId) {
    return (
      <p className="text-center text-gray-400 mt-4">
        Select or create a file to start editing
      </p>
    );
  }

  return (
    <div className={`h-full ${className}`} style={style}>
      <Editor
        height="100%"
        language={language || "javascript"}
        value={code}                 // ✅ single source of truth
        onMount={onMount}
        onChange={(val) => onChange(val ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          showUnused: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
          lineNumbersMinChars: 3,
          fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
          fontLigatures: true,
          "bracketPairColorization.enabled": true,
          "guides.bracketPairs": "active",
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
