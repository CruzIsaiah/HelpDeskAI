import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onSessionId: (id: string) => void;
}

export default function VoiceRecorder({
  onTranscript,
  onSessionId,
}: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      const response = await fetch("http://localhost:8000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onSessionId(data.session_id);
        onTranscript(data.transcript);
      } else {
        alert("Transcription failed: " + data.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={loading}
        className={`btn ${
          recording ? "bg-red-500 hover:bg-red-600 text-white" : "btn-primary"
        } disabled:opacity-50`}
      >
        {loading ? (
          <>Recording... (processing)</>
        ) : recording ? (
          <>
            <FaStop /> Stop Recording
          </>
        ) : (
          <>
            <FaMicrophone /> Start Recording
          </>
        )}
      </button>

      {recording && (
        <div className="flex items-center gap-2 text-red-500 animate-pulse">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
}
