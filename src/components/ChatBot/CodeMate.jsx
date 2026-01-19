import React, { useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { askCodeMate } from "./chatApi";
import "./chatbot.css";

const LANGUAGES = ["javascript", "python", "cpp", "java"]; // add more if needed

export default function CodeMate() {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("javascript");

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `
You are CodeMate, an AI coding assistant inside an online compiler.

Strict rules:
1. Always provide **three approaches** for every logic question:
   1. Brute Force
   2. Better Approach
   3. Optimal Approach
2. Always explain **time and space complexity** for each approach.
3. Always write code in the **programming language selected by the user** (use the variable "selectedLang").
4. Respond in simple, beginner-friendly language.
5. Use Markdown formatting with numbered lists and code blocks.

Example:
1. Brute Force
\`\`\`${selectedLang}
// code here
\`\`\`
Time Complexity: O(...)
Space Complexity: O(...)

2. Better Approach
\`\`\`${selectedLang}
// code here
\`\`\`
Time Complexity: O(...)
Space Complexity: O(...)

3. Optimal Approach
\`\`\`${selectedLang}
// code here
\`\`\`
Time Complexity: O(...)
Space Complexity: O(...)
`
    },
    {
      role: "assistant",
      content: "Hi 👋 I'm CodeMate. Ask me about logic, optimization, or errors."
    }
  ]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      // Always pass the language to the prompt
      const reply = await askCodeMate([
        ...updated,
        { role: "system", content: `Use ${selectedLang} for all code.` }
      ]);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to Groq API." },
      ]);
    }
  };

  return (
    <>
      <button
  onClick={() => setOpen(!open)}
  style={{
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    minWidth: "60px",
    minHeight: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 999999,
  }}
>
  💬
</button>


      {open && (
        <div className={`chat-container ${fullScreen ? "fullscreen" : ""}`}>
          <div className="chat-header">
            <span>CodeMate AI</span>
            <div className="chat-header-buttons">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="language-select"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <button onClick={() => setFullScreen(!fullScreen)}>
                {fullScreen ? "🗗" : "🗖"}
              </button>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>
          </div>

          <div className="chat-body">
            {messages
              .filter((m) => m.role !== "system")
              .map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}
          </div>

          <ChatInput onSend={sendMessage} />
        </div>
      )}
    </>
  );
}
