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
    getSolution();
  }, [sessionId]);

  const getSolution = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: transcript }),
      });

      const data = await response.json();

      if (response.ok) {
        setSolution(data.answer);
      } else {
        setError(data.detail || "Failed to get solution.");
      }
    } catch (err) {
      console.error("Error fetching solution:", err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const downloadManual = async (format: "pdf" | "markdown") => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/manual/generate",
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

  // ----------------------------
  // UI RENDERING
  // ----------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 bg-red-50 border-red-200 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* USER ISSUE */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Your Issue:</h3>
        <p className="text-gray-700">{transcript}</p>
      </div>

      {/* AI SOLUTION */}
      <div className="card card-strong p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Solution:</h3>

        <ReactMarkdown className="prose prose-sm max-w-none">
          {solution}
        </ReactMarkdown>
      </div>

      {/* DOWNLOAD BUTTONS */}
      <div className="flex gap-4">
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
  );
}
