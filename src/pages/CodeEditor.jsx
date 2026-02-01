import { useRef, useState, useEffect, useCallback } from "react";
import TopBar from "../components/TopBar";
import FileBar from "../components/FileBar";
import Output from "../components/Output";
import CodeEditorWindow from "../components/CodeEditorWindow";
import CodeMate from "../components/ChatBot/CodeMate"; 

import { executeCode } from "../utils/api";
import { CODE_SNIPPETS } from "../utils/constant";
import useKeyPress from "../hooks/keyPress";
import { useTheme } from "../context/ThemeContext";

const TOP_BAR_HEIGHT = 40;
const FILE_BAR_HEIGHT = 50;

const CodeEditor = () => {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  /* -------------------- FILE STATE -------------------- */
  const [openFiles, setOpenFiles] = useState([
    {
      id: "file1",
      name: "main.js",
      content: CODE_SNIPPETS.javascript,
      language: "javascript",
    },
  ]);
  const [activeFileId, setActiveFileId] = useState("file1");

  const activeFile = openFiles.find((f) => f.id === activeFileId);

  /* -------------------- EDITOR STATE -------------------- */
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS.javascript);
  const [version, setVersion] = useState("");

  const [editorHeight, setEditorHeight] = useState(
    window.innerHeight - TOP_BAR_HEIGHT - FILE_BAR_HEIGHT
  );

  /* -------------------- OUTPUT STATE -------------------- */
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState({
    stdout: "",
    stderr: "",
    compile_output: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  /* -------------------- SHORTCUTS -------------------- */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  /* -------------------- MONACO MOUNT -------------------- */
  const onMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  /* -------------------- CODE CHANGE -------------------- */
  const onCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId ? { ...f, content: newCode } : f
        )
      );
    },
    [activeFileId]
  );

  /* -------------------- LANGUAGE CHANGE -------------------- */
  const onLanguageSelect = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      const snippet = CODE_SNIPPETS[newLanguage] || "";

      setCode(snippet);
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId
            ? { ...f, language: newLanguage, content: snippet }
            : f
        )
      );

      setTimeout(() => {
        editorRef.current?.setValue(snippet);
      }, 0);
    },
    [activeFileId]
  );

  /* -------------------- FILE SWITCH -------------------- */
  const onFileSelect = useCallback(
    (id) => {
      const file = openFiles.find((f) => f.id === id);
      if (!file) return;

      setActiveFileId(id);
      setLanguage(file.language);
      setCode(file.content);

      setTimeout(() => {
        editorRef.current?.setValue(file.content);
      }, 0);
    },
    [openFiles]
  );

  /* -------------------- NEW FILE -------------------- */
  const onNewFile = useCallback(() => {
    const id = `file-${Date.now()}`;
    const file = {
      id,
      name: `untitled.js`,
      content: "",
      language: "javascript",
    };

    setOpenFiles((prev) => [...prev, file]);
    setActiveFileId(id);
    setLanguage("javascript");
    setCode("");

    setTimeout(() => {
      editorRef.current?.setValue("");
    }, 0);
  }, []);

  /* -------------------- CLOSE FILE -------------------- */
  const onFileClose = useCallback(
    (id) => {
      setOpenFiles((prev) => {
        const remaining = prev.filter((f) => f.id !== id);
        if (remaining.length === 0) return prev;

        if (id === activeFileId) {
          const next = remaining[0];
          setActiveFileId(next.id);
          setLanguage(next.language);
          setCode(next.content);

          setTimeout(() => {
            editorRef.current?.setValue(next.content);
          }, 0);
        }
        return remaining;
      });
    },
    [activeFileId]
  );

  /* -------------------- RUN CODE -------------------- */
  const runCode = useCallback(async () => {
    const source = editorRef.current?.getValue();
    if (!source) return;

    try {
      setIsLoading(true);
      const { run } = await executeCode(language, source);

      setOutput(run || {});
      setIsError(!!run?.stderr || !!run?.compile_output);
      setShowOutput(true);
    } catch (e) {
      setIsError(true);
      setOutput({ stderr: e.message });
      setShowOutput(true);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  /* -------------------- SHARE CODE -------------------- */
  const handleShareCode = useCallback(() => {
    const source = editorRef.current?.getValue();
    if (!source) return;

    const encoded = btoa(unescape(encodeURIComponent(source)));
    const url = `${window.location.origin}/editor?code=${encoded}`;

    navigator.clipboard.writeText(url);
    alert("Shareable code link copied!");
  }, []);

  /* -------------------- LOAD SHARED CODE (ONCE) -------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCode = params.get("code");
    if (!sharedCode) return;

    try {
      const decoded = decodeURIComponent(escape(atob(sharedCode)));

      setCode(decoded);
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.id === "file1" ? { ...f, content: decoded } : f
        )
      );

      setTimeout(() => {
        editorRef.current?.setValue(decoded);
      }, 0);
    } catch {
      console.error("Invalid shared code");
    }
  }, []);

  /* -------------------- CTRL + ENTER -------------------- */
  useEffect(() => {
    if (ctrlPress && enterPress) runCode();
  }, [ctrlPress, enterPress, runCode]);

  /* -------------------- RESIZE -------------------- */
  useEffect(() => {
    const resize = () =>
      setEditorHeight(window.innerHeight - TOP_BAR_HEIGHT - FILE_BAR_HEIGHT);

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* -------------------- RENDER -------------------- */
  return (
    <div
      className={`h-screen flex flex-col relative ${
        theme === "dark"
          ? "bg-dark-background-primary"
          : "bg-light-background-primary"
      }`}
    >
      <TopBar onShare={handleShareCode} />

      <FileBar
        language={language}
        onLanguageSelect={onLanguageSelect}
        onRunCode={runCode}
        onShare={handleShareCode}
        isLoading={isLoading}
        openFiles={openFiles}
        activeFileId={activeFileId}
        onFileSelect={onFileSelect}
        onFileClose={onFileClose}
        onNewFile={onNewFile}
        onVersionSelect={setVersion}
      />

      <CodeEditorWindow
        style={{ height: editorHeight }}
        onChange={onCodeChange}
        activeFileId={activeFileId}
        language={language}
        code={code}
        onMount={onMount}
      />

      <Output
        output={output}
        isError={isError}
        showOutput={showOutput}
        toggleTerminal={setShowOutput}
      />

      <CodeMate />
    </div>
  );
};

export default CodeEditor;