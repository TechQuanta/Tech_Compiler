import { useRef, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import TopBar from "../components/TopBar";
import FileBar from "../components/FileBar";
import Output from "../components/Output";
import CodeEditorWindow from "../components/CodeEditorWindow";
import CodeMate from "../components/ChatBot/CodeMate";
import ShareModal from "../components/ShareModal";
import CollaborationPanel from "../components/CollaborationPanel";
import { executeCode } from "../utils/api";
import { CODE_SNIPPETS } from "../utils/constant";
import useKeyPress from "../hooks/keyPress";
import { useTheme } from "../context/ThemeContext";

const SOCKET_SERVER_URL = "http://localhost:5000";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  const codeRef = useRef("");
  const activeFileRef = useRef("");

  const { theme } = useTheme();

  const [sessionId, setSessionId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [openFiles, setOpenFiles] = useState([
    { id: "file1", name: "main.js", content: CODE_SNIPPETS.javascript, language: "javascript" },
  ]);

  const [activeFileId, setActiveFileId] = useState("file1");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS.javascript);

  const [version, setVersion] = useState("");   // ✅ FIXED

  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollabPanelOpen, setIsCollabPanelOpen] = useState(false);

  /* -------------------- SHORTCUTS -------------------- */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  /* -------------------- LIVE REFS -------------------- */
  useEffect(() => { codeRef.current = code; }, [code]);
  useEffect(() => { activeFileRef.current = activeFileId; }, [activeFileId]);

  /* -------------------- SOCKET INIT (ONCE) -------------------- */
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { autoConnect: false });

    const urlParams = new URLSearchParams(window.location.search);
    const joinId = urlParams.get("session");

    if (joinId) {
      joinSession(joinId);
      setIsCollabPanelOpen(true);
    }

    socketRef.current.on("code-update", (newCode) => {
      if (newCode !== codeRef.current) {
        setCode(newCode);

        setOpenFiles((prev) =>
          prev.map((f) =>
            f.id === activeFileRef.current ? { ...f, content: newCode } : f
          )
        );
      }
    });

    socketRef.current.on("participants-update", (users) => {
      setParticipants(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  /* -------------------- EDITOR -------------------- */
  const onMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const onCodeChange = useCallback((newCode) => {
    setCode(newCode);

    setOpenFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: newCode } : f
      )
    );

    if (isSessionActive && socketRef.current) {
      socketRef.current.emit("code-change", { sessionId, newCode });
    }
  }, [activeFileId, isSessionActive, sessionId]);

  /* -------------------- SESSION -------------------- */
  const ensureConnection = () => {
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  };

  const startSession = useCallback(() => {
    if (isSessionActive) return;   // ✅ Guard

    const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();

    ensureConnection();

    socketRef.current.emit("create-session", newSessionId, () => {
      setSessionId(newSessionId);
      setIsSessionActive(true);

      window.history.pushState({}, "", `?session=${newSessionId}`);
    });
  }, [isSessionActive]);

  const joinSession = useCallback((id) => {
    if (!id) return;

    const cleanId = id.trim().toUpperCase();

    ensureConnection();

    socketRef.current.emit("join-session", cleanId, (success, currentCode) => {
      if (success) {
        setSessionId(cleanId);
        setIsSessionActive(true);

        if (currentCode) {
          setCode(currentCode);

          setOpenFiles((prev) =>
            prev.map((f) =>
              f.id === activeFileId ? { ...f, content: currentCode } : f
            )
          );

          editorRef.current?.setValue(currentCode);
        }
      } else {
        alert("Session not found or full.");
      }
    });
  }, [activeFileId]);

  const endSession = useCallback(() => {
    if (!sessionId) return;

    socketRef.current.emit("leave-session", sessionId);
    socketRef.current.disconnect();

    setIsSessionActive(false);
    setSessionId("");
    setParticipants([]);

    window.history.pushState({}, "", window.location.pathname);
  }, [sessionId]);

  /* -------------------- RUN CODE -------------------- */
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

  /* -------------------- FILE MANAGEMENT -------------------- */
  const onFileSelect = (id) => {
    const file = openFiles.find((f) => f.id === id);
    if (!file) return;

    setActiveFileId(id);
    setLanguage(file.language);
    setCode(file.content);

    editorRef.current?.setValue(file.content);
  };

  const onLanguageSelect = useCallback((newLanguage) => {
    const snippet = CODE_SNIPPETS[newLanguage] || "";

    setLanguage(newLanguage);
    setCode(snippet);

    setOpenFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId
          ? { ...f, language: newLanguage, content: snippet }
          : f
      )
    );

    editorRef.current?.setValue(snippet);
  }, [activeFileId]);

  const onNewFile = useCallback(() => {
    const id = `file-${Date.now()}`;

    const file = {
      id,
      name: "untitled.js",
      content: "",
      language: "javascript",
    };

    setOpenFiles((prev) => [...prev, file]);
    setActiveFileId(id);
    setLanguage("javascript");
    setCode("");

    editorRef.current?.setValue("");
  }, []);

  const onFileClose = useCallback((id) => {
    setOpenFiles((prev) => {
      const remaining = prev.filter((f) => f.id !== id);
      if (remaining.length === 0) return prev;

      if (id === activeFileId) {
        const next = remaining[0];

        setActiveFileId(next.id);
        setLanguage(next.language);
        setCode(next.content);

        editorRef.current?.setValue(next.content);
      }

      return remaining;
    });
  }, [activeFileId]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden relative ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      
      <TopBar
        onShare={() => setIsShareModalOpen(true)}
        onCollaborate={() => setIsCollabPanelOpen(!isCollabPanelOpen)}
      />

      <FileBar
        language={language}
        setLanguage={setLanguage}
        onRunCode={runCode}
        isLoading={isLoading}
        openFiles={openFiles}
        activeFileId={activeFileId}
        onFileSelect={onFileSelect}
        onLanguageSelect={onLanguageSelect}
        onFileClose={onFileClose}
        onNewFile={onNewFile}
        onVersionSelect={setVersion}
      />

      <div className="flex-grow flex flex-col relative overflow-hidden">
        <CodeEditorWindow
          code={code}
          onChange={onCodeChange}
          language={language}
          onMount={onMount}
        />

        <Output
          output={output}
          isError={isError}
          showOutput={showOutput}
          isLoading={isLoading}
          onClose={() => setShowOutput(false)}
        />

        <CollaborationPanel
          isOpen={isCollabPanelOpen}
          onClose={() => setIsCollabPanelOpen(false)}
          isSessionActive={isSessionActive}
          sessionId={sessionId}
          participants={participants}
          onStartSession={startSession}
          onEndSession={endSession}
          onJoinSession={joinSession}
        />
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        code={code}
      />

      <CodeMate />
    </div>
  );
};

export default CodeEditor;
