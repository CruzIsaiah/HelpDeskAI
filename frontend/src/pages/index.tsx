import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import VoiceRecorder from "@/components/VoiceRecorder";
import RagPanel from "@/components/RagPanel";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [typedInput, setTypedInput] = useState("");

  const handleTextSubmit = () => {
    if (!typedInput.trim()) return;
    setTranscript(typedInput);
    setSessionId("manual-" + Date.now());
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="app-shell px-4 py-8">
        {/* NAVBAR */}
        <header className="app-header mb-8 flex flex-col items-center">
          <Navbar />
        </header>

        {/* RECORD SECTION */}
        <section id="record" className="card p-6 mb-6 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Record or Type Your Issue
          </h2>

          <div className="mb-4">
            <VoiceRecorder
              onTranscript={(t) => setTranscript(t)}
              onSessionId={(id) => setSessionId(id)}
            />
          </div>

          {/* OR divider */}
          <div className="flex items-center my-3">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Typed input */}
          <div className="mt-3 w-full">
            <textarea
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              rows={4}
              placeholder="Type your question here..."
              className="block p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
              style={{ width: "100%" }}
            />

            <button
              onClick={handleTextSubmit}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit Question
            </button>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="card card-strong p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Solution</h2>

          {sessionId && transcript ? (
            <RagPanel sessionId={sessionId} transcript={transcript} />
          ) : (
            <p className="text-gray-600">
              Ask a question or record your issue to get started…
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
