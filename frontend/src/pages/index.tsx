import React from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TroubleshootingPanel from "@/components/TroubleshootingPanel";

export default function Home() {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [transcript, setTranscript] = React.useState<string>("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HelpDesk Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Voice-powered troubleshooting system
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Recording Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Record Issue
            </h2>
            <VoiceRecorder
              onTranscript={setTranscript}
              onSessionId={setSessionId}
            />
          </section>

          {/* Troubleshooting Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Solution
            </h2>
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
