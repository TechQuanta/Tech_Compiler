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

const CodeEditor = () => {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [openFiles, setOpenFiles] = useState([
    {
      id: "file1",
      name: "main.js",
      content: CODE_SNIPPETS.javascript,
      language: "javascript",
    },
  ]);
  const [activeFileId, setActiveFileId] = useState("file1");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS.javascript);
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [version, setVersion] = useState("");

  /* -------------------- SHORTCUTS -------------------- */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  const onMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const onCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setOpenFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
    );
  }, [activeFileId]);

  const runCode = useCallback(async () => {
    const source = editorRef.current?.getValue();
    if (!source) return;

    setShowOutput(true);
    setIsLoading(true);
    
    try {
      const { run } = await executeCode(language, source);
      setOutput(run || {});
      setIsError(!!run?.stderr || !!run?.compile_output);
    } catch (e) {
      setIsError(true);
      setOutput({ stderr: e.message });
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (ctrlPress && enterPress) runCode();
  }, [ctrlPress, enterPress, runCode]);

  const onFileSelect = (id) => {
    const file = openFiles.find((f) => f.id === id);
    if(file) {
        setActiveFileId(id);
        setLanguage(file.language);
        setCode(file.content);
        editorRef.current?.setValue(file.content);
    }
  };

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

  const handleShareCode = useCallback(() => {
    const source = editorRef.current?.getValue();
    if (!source) return;

    const encoded = btoa(unescape(encodeURIComponent(source)));
    const url = `${window.location.origin}/editor?code=${encoded}`;

    navigator.clipboard.writeText(url);
    alert("Shareable code link copied!");
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

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
      
      <TopBar />
      
      <FileBar
        language={language}
        setLanguage={setLanguage}
        onRunCode={runCode}
        isLoading={isLoading}
        openFiles={openFiles}
        activeFileId={activeFileId}
        onFileSelect={onFileSelect}
        onLanguageSelect={onLanguageSelect}
        onShare={handleShareCode}
        onFileClose={onFileClose}
        onNewFile={onNewFile}
        onVersionSelect={setVersion}
      />

      <div className="flex-grow flex flex-col relative overflow-hidden">
        <div className={`flex-grow transition-all duration-300 ease-in-out ${showOutput ? 'h-[65%]' : 'h-full'}`}>
           <CodeEditorWindow
             code={code}
             onChange={onCodeChange}
             language={language}
             onMount={onMount}
             activeFileId={activeFileId}
           />
        </div>

        <Output
          output={output}
          isError={isError}
          showOutput={showOutput}
          isLoading={isLoading}
          onClose={() => setShowOutput(false)}
        />
        
      </div>

      <CodeMate />
    </div>
  );
};

export default CodeEditor;