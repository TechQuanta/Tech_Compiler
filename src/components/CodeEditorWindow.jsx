// src/components/CodeEditorWindow.jsx
import Editor from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../utils/constant"; // Correct path to constant.js

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  onMount,
  className = "",
  style = {},
  activeFileId,
  // openFiles,
}) => {
  return activeFileId ? (
    <div className={`h-full ${className}`} style={style}>
      <Editor
        height="100%" 
        language={language || "javascript"}
        onMount={onMount}
        value={code}
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
        defaultValue={CODE_SNIPPETS[language]}
        onChange={(val) => onChange(val)}
      />
    </div>
  ) : (
    <p>Select or create a file to start editing</p>
  );
};

export default CodeEditorWindow;
