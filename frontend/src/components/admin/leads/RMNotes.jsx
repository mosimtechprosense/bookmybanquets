import { useEffect, useState } from "react";
import { fetchRMNotes, addRMNote } from "../../../api/admin/lead.api.js";

export default function RMNotes({ leadId, close }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!leadId) return;
    const res = await fetchRMNotes(leadId);
    setNotes(res.data);
  };

  useEffect(() => {
    load();
  }, [leadId]);

  const submit = async () => {
    if (!note.trim()) return;
    setLoading(true);
    try {
      await addRMNote(leadId, note);
      setNote("");
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg max-w-lg mx-4 w-[600px] md:mx-auto max-h-[80vh] overflow-y-auto px-8 py-7 select-none"
      onClick={e => e.stopPropagation()}  
    >
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-xl font-bold text-cyan-700">RM Notes</h2>
        <button
          onClick={close}
          className="text-gray-500 text-xl hover:text-black cursor-pointer"
        >
          ×
        </button>
      </div>

      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
        rows={4}
        placeholder="Write a note…"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading || !note.trim()}
        className="mt-3 px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
      >
        Add Note
      </button>

      <div className="mt-6 space-y-3">
        {notes.length === 0 && (
          <p className="text-gray-400 text-sm">No notes yet</p>
        )}
        {notes.map(n => (
          <div key={n.id} className="bg-gray-100 p-3 rounded-lg text-sm">
            {n.note}
          </div>
        ))}
      </div>
    </div>
  );
}