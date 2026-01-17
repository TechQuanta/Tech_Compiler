// src/components/ChatBot/ChatBubble.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatBubble({ message }) {
  return (
    <div
      className={`chat-bubble ${message.role} break-words`}
      style={{ marginBottom: "12px" }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <SyntaxHighlighter
                style={materialDark}
                language={className?.replace("language-", "") || "javascript"}
                {...props}
              >
                {children}
              </SyntaxHighlighter>
            ) : (
              <code
                className="inline-code"
                style={{ backgroundColor: "#2b2b3b", padding: "2px 4px", borderRadius: "4px" }}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
}
