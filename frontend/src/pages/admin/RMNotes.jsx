import { useEffect, useState } from "react";
import { fetchRMNotes, addRMNote } from "../../api/lead.api";

export default function RMNotes({ leadId }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  const load = () =>
    fetchRMNotes(leadId).then(res => setNotes(res.data));

  useEffect(load, [leadId]);

  const submit = async () => {
    await addRMNote(leadId, note);
    setNote("");
    load();
  };

  return (
    <div>
      <h3>RM Notes</h3>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button onClick={submit}>Add</button>

      {notes.map(n => (
        <p key={n.id}>{n.note}</p>
      ))}
    </div>
  );
}
