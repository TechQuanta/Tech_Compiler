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
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollabPanelOpen, setIsCollabPanelOpen] = useState(false);

  /* -------------------- SHORTCUTS -------------------- */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { autoConnect: false });

    const urlParams = new URLSearchParams(window.location.search);
    const joinId = urlParams.get('session');
    
    if (joinId) {
      joinSession(joinId);
      setIsCollabPanelOpen(true);
    }

    socketRef.current.on("code-update", (newCode) => {
      if (newCode !== code) {
        setCode(newCode);
        setOpenFiles((prev) =>
          prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
        );
      }
    });

    socketRef.current.on("participants-update", (users) => {
      setParticipants(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [activeFileId]);

  const onMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const onCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setOpenFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
    );
    if (isSessionActive && socketRef.current) {
      socketRef.current.emit("code-change", { sessionId, newCode });
    }
  }, [activeFileId, isSessionActive, sessionId]);

  const startSession = useCallback(() => {
    const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socketRef.current.connect();
    socketRef.current.emit("create-session", newSessionId, () => {
      setSessionId(newSessionId);
      setIsSessionActive(true);
      window.history.pushState({}, '', `?session=${newSessionId}`);
    });
  }, []);

  const joinSession = useCallback((id) => {
    socketRef.current.connect();
    socketRef.current.emit("join-session", id, (success, currentCode) => {
      if (success) {
        setSessionId(id);
        setIsSessionActive(true);
        if (currentCode) setCode(currentCode);
      } else {
        alert("Session not found or full.");
      }
    });
  }, []);

  const endSession = useCallback(() => {
    socketRef.current.emit("leave-session", sessionId);
    socketRef.current.disconnect();
    setIsSessionActive(false);
    setSessionId("");
    setParticipants([]);
    window.history.pushState({}, '', window.location.pathname);
  }, [sessionId]);

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

  const onLanguageSelect = useCallback((newLanguage) => {
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

  const onFileClose = useCallback((id) => {
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

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} code={code}/>
      <CodeMate />
    </div>
  );
};

export default CodeEditor;