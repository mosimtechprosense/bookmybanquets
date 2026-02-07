import { useEffect, useState } from "react";
import { fetchLeadEvents, addLeadEvent } from "../../../api/admin/lead.api";

export default function LeadEvents({ leadId, close }) {
  const [events, setEvents] = useState([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!leadId) return;
    const res = await fetchLeadEvents(leadId);
    setEvents(res.data);
  };

  useEffect(() => {
    load();
  }, [leadId]);

  const submit = async () => {
    if (!type.trim() || !description.trim()) return;
    setLoading(true);
    try {
      await addLeadEvent(leadId, { type, description });
      setType("");
      setDescription("");
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg max-w-lg mx-4 w-[600px] md:mx-auto max-h-[80vh] overflow-y-auto px-8 py-7"
      onClick={e => e.stopPropagation()}   
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-700">Lead Events</h2>
        <button
          onClick={close}
          className="text-gray-500 text-xl hover:text-black cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Form */}
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm mb-3 focus:ring-2 focus:ring-green-500"
        placeholder="Type (Call, Visit, Meeting)"
        value={type}
        onChange={e => setType(e.target.value)}
      />

      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-green-500"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading || !type || !description}
        className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        Add Event
      </button>

      {/* List */}
      <div className="mt-6 space-y-3">
        {events.length === 0 && (
          <p className="text-gray-400 text-sm">No events yet</p>
        )}

        {events.map(e => (
          <div
            key={e.id}
            className="bg-green-50 border border-green-100 p-3 rounded-lg text-sm"
          >
            <div className="font-semibold text-green-700">
              {e.type}
            </div>
            <div className="text-gray-700 mt-1">
              {e.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
