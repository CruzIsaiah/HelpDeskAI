import { useState, useEffect } from "react";
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
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelected(item)}
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
        )}

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="card max-w-2xl w-full relative overflow-auto max-h-[90vh]">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-2">{selected.transcript}</h2>

              <p className="muted mb-4">
                {new Date(selected.created_at).toLocaleString()}
              </p>

              <div className="prose whitespace-pre-line">
                {selected.manual_markdown || "No solution available."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
