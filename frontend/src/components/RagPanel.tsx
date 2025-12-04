import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface TroubleshootingPanelProps {
  sessionId: string;
  transcript: string;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function TroubleshootingPanel({
  sessionId,
  transcript,
}: TroubleshootingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keep a ref to the latest messages so async callbacks can read it
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // remember last transcript to avoid re-processing the same input twice
  const lastTranscriptRef = useRef<string>("");

  // Only trigger when transcript changes (avoid double-calling when sessionId also updates)
  useEffect(() => {
    const norm = normalize(transcript);
    if (transcript && norm && norm !== lastTranscriptRef.current) {
      lastTranscriptRef.current = norm;
      sendQuery(transcript, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const normalize = (s: string | undefined) =>
    (s || "").toString().trim().replace(/\s+/g, " ");

  const buildConversationText = (msgs: Message[]) =>
    msgs.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");

  const sendQuery = async (
    text: string,
    replaceLoading = false,
    appendUser = true
  ) => {
    setError("");
    if (replaceLoading) setLoading(true);

    // Optimistically append the user message (avoid exact consecutive duplicates)
    if (appendUser) {
      setMessages((m) => {
        const last = m.length ? m[m.length - 1] : undefined;
        if (
          last &&
          last.role === "user" &&
          normalize(last.content) === normalize(text)
        )
          return m;
        return m.concat({ role: "user", content: text });
      });
    }

    try {
      const convoMsgs = appendUser
        ? messagesRef.current.concat({ role: "user", content: text })
        : messagesRef.current;
      const convo = buildConversationText(convoMsgs);

      console.log("Sending query:", convo); // DEBUG LOG
      console.log("Session ID:", sessionId); // DEBUG LOG

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/api/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: convo, session_id: sessionId }),
      });

      const data = await response.json();

      console.log("API Response:", data); // DEBUG LOG

      if (response.ok) {
        console.log("Answer received:", data.answer); // DEBUG LOG
        // Append assistant reply, avoid duplicate consecutive assistant content
        setMessages((m) => {
          const last = m.length ? m[m.length - 1] : undefined;
          if (
            last &&
            last.role === "assistant" &&
            normalize(last.content) === normalize(data.answer)
          )
            return m;
          return m.concat({ role: "assistant", content: data.answer });
        });
        setInput("");
      } else {
        console.error("API Error:", data); // DEBUG LOG
        setError(data.detail || "Failed to get solution.");
      }
    } catch (err) {
      console.error("Error fetching solution:", err);
      setError("Could not connect to the server.");
    } finally {
      if (replaceLoading) setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setLoading(true);
    await sendQuery(text);
    setLoading(false);
  };

  const getLastMessage = (role: "user" | "assistant"): Message | undefined => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === role) return messages[i];
    }
    return undefined;
  };

  // remove consecutive duplicate messages for rendering and downloads
  const dedupedMessages = useMemo(() => {
    const out: Message[] = [];
    for (const m of messages) {
      const prev = out.length ? out[out.length - 1] : undefined;
      if (
        prev &&
        prev.role === m.role &&
        normalize(prev.content) === normalize(m.content)
      )
        continue;
      out.push(m);
    }
    return out;
  }, [messages]);

  const downloadManual = async (format: "pdf" | "markdown") => {
    try {
      const latestUser = (() => {
        for (let i = dedupedMessages.length - 1; i >= 0; i--) {
          if (dedupedMessages[i].role === "user")
            return dedupedMessages[i].content;
        }
        return transcript;
      })();

      const latestAssistant = (() => {
        for (let i = dedupedMessages.length - 1; i >= 0; i--) {
          if (dedupedMessages[i].role === "assistant")
            return dedupedMessages[i].content;
        }
        return "";
      })();

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/api/manual/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_description: latestUser,
          solution: latestAssistant,
          format,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // browser-friendly base64 -> blob
        const byteCharacters = atob(data.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++)
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: format === "pdf" ? "application/pdf" : "text/markdown",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `troubleshooting-guide.${format === "pdf" ? "pdf" : "md"}`;
        a.click();
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ----------------------------
  // UI RENDERING
  // ----------------------------

  if (loading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="card p-4 bg-red-50 border-red-200 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversation */}
      <div className="card p-4 max-h-96 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {dedupedMessages.map((m, idx) => (
            <div
              key={idx}
              className={`w-full flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm border ${
                  m.role === "user"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Send a follow-up question or clarification..."
          className="block p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4 chat-input-size"
        />
        <div className="flex flex-col gap-2">
          <button onClick={handleSend} className="btn btn-primary">
            Send
          </button>
          <button
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            className="btn btn-ghost"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Latest assistant answer + downloads */}
      <div className="card card-strong p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Latest Answer:</h3>
        <ReactMarkdown className="prose prose-sm max-w-none">
          {(() => {
            for (let i = dedupedMessages.length - 1; i >= 0; i--) {
              if (dedupedMessages[i].role === "assistant")
                return dedupedMessages[i].content;
            }
            return "No answer yet.";
          })()}
        </ReactMarkdown>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => downloadManual("pdf")}
            className="btn btn-primary flex-1"
          >
            Download PDF
          </button>
          <button
            onClick={() => downloadManual("markdown")}
            className="btn btn-ghost flex-1"
          >
            Download Markdown
          </button>
        </div>
      </div>
    </div>
  );
}
