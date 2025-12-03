import React from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TroubleshootingPanel from "@/components/TroubleshootingPanel";

export default function Home() {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [transcript, setTranscript] = React.useState<string>("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="app-shell px-4 py-8">
        <header className="app-header mb-8">
          <nav className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl app-title">HelpDesk Assistant</h1>
                <p className="text-sm app-subtitle">
                  Voice-powered troubleshooting
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-4 items-center">
              <a className="btn btn-ghost" href="#">
                Docs
              </a>
              <button className="btn btn-primary">Get Help</button>
            </div>
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 app-grid">
          {/* Voice Recording Section */}
          <section className="card p-8">
            <h2 className="section-title mb-6">Record Issue</h2>
            <VoiceRecorder
              onTranscript={setTranscript}
              onSessionId={setSessionId}
            />
          </section>

          {/* Troubleshooting Section */}
          <section className="card card-strong p-8">
            <h2 className="section-title mb-6">Solution</h2>
            {sessionId && transcript ? (
              <TroubleshootingPanel
                sessionId={sessionId}
                transcript={transcript}
              />
            ) : (
              <div className="text-gray-500 text-center py-12">
                <p>Record your issue to get started...</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
