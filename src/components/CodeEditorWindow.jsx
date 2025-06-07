// src/components/CodeEditorWindow.jsx
import Editor from "@monaco-editor/react";
import { CODE_SNIPPETS } from "./constant"; // Correct path to constant.js

const CodeEditorWindow = ({ onChange, language, code, onMount, className = "", style = {} }) => {
  return (
    <div className={`h-full ${className}`} style={style}>
      <Editor
        height="100%" // Editor takes full height of its parent div
        language={language || "javascript"}
        onMount={onMount}
        value={code}
        theme="vs-dark" // VS Code's dark theme
        options={{
          minimap: { enabled: true }, // Show the minimap (code overview)
          fontSize: 14, // Set a comfortable default font size
          scrollBeyondLastLine: false, // Don't allow scrolling past the last line
          wordWrap: "on", // Wrap long lines
          showUnused: true, // Highlight unused variables/imports
          // More options for a "wow" feel:
          cursorBlinking: "smooth", // Smooth cursor animation
          cursorSmoothCaretAnimation: "on", // Animated smooth caret movement
          renderLineHighlight: "all", // Highlight the whole line, not just the content
          lineNumbersMinChars: 3, // Minimum width for line numbers
          fontFamily: "Fira Code, Consolas, 'Courier New', monospace", // Use a popular coding font (install Fira Code for best results)
          fontLigatures: true, // Enable font ligatures if the font supports them
          'bracketPairColorization.enabled': true, // Colorize matching brackets
          'guides.bracketPairs': 'active', // Show guides for bracket pairs
        }}
        defaultValue={CODE_SNIPPETS[language]}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
};

export default CodeEditorWindow;