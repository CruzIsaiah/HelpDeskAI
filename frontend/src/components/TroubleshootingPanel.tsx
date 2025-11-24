import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface TroubleshootingPanelProps {
  sessionId: string;
  transcript: string;
}

export default function TroubleshootingPanel({
  sessionId,
  transcript,
}: TroubleshootingPanelProps) {
  const [solution, setSolution] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getTroubleshooting();
  }, [sessionId]);

  const getTroubleshooting = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/troubleshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSolution(data.solution.solution);
      } else {
        setError(data.detail || "Failed to get solution");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadManual = async (format: "pdf" | "markdown") => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/generate-manual",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            issue_description: transcript,
            solution,
            format,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const blob = new Blob([Buffer.from(data.content, "base64")], {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Your Issue:</h3>
        <p className="text-gray-700">{transcript}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Solution:</h3>
        <ReactMarkdown className="prose prose-sm max-w-none">
          {solution}
        </ReactMarkdown>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => downloadManual("pdf")}
          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
        >
          Download PDF
        </button>
        <button
          onClick={() => downloadManual("markdown")}
          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          Download Markdown
        </button>
      </div>
    </div>
  );
}
