import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";

interface HistoryItem {
  id: string;
  transcript: string;
  manual_markdown: string;
  created_at: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  // when a modal is opened, scroll to top so the popup is visible
  useEffect(() => {
    if (selected) {
      try {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      // also scroll the details panel to top so the conversation box is visible
      try {
        if (detailsRef.current) {
          detailsRef.current.scrollTop = 0;
          detailsRef.current.scrollIntoView({
            block: "start",
            behavior: "smooth",
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }, [selected]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="app-shell">
        {/* Navbar */}
        <header className="app-header mb-8">
          <Navbar />
        </header>

        {/* Loading */}
        {loading ? (
          <div className="card text-center py-16">
            <p className="muted animate-pulse text-lg">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="card text-center py-16">
            <p className="muted text-lg">
              No history yet. Record your first issue!
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="flex flex-row flex-nowrap">
              {/* Left: history table */}
              <div className="w-1/3 min-w-[320px] h-[80vh] overflow-auto pr-2">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Question
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Summary
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          selected?.id === item.id ? "bg-indigo-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {item.transcript}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.manual_markdown
                            ? item.manual_markdown.substring(0, 80) + "..."
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right: selected detail panel */}
              <div
                ref={detailsRef}
                className="flex-1 border-l p-6 h-[80vh] overflow-auto pl-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold sticky top-0 bg-white py-2">
                    Conversation
                  </h3>
                  {selected && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelected(null)}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {selected ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-2">
                      {selected.transcript}
                    </h2>
                    <p className="muted mb-2">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                    <div className="prose whitespace-pre-line">
                      {selected.manual_markdown || "No solution available."}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-600">
                    <p className="font-medium">Select a chat to view details</p>
                    <p className="text-sm muted">
                      Click any row on the left to open the conversation here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Modal removed — details are shown inline on the right panel */}
      </div>
    </div>
  );
}
