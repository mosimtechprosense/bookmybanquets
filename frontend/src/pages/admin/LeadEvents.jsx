import { useEffect, useState } from "react";
import { fetchLeadEvents, addLeadEvent } from "../../api/lead.api";

export default function LeadEvents({ leadId }) {
  const [events, setEvents] = useState([]);
  const [type, setType] = useState("");
  const [comment, setComment] = useState("");

  const load = () =>
    fetchLeadEvents(leadId).then(res => setEvents(res.data));

  useEffect(load, [leadId]);

  const submit = async () => {
    await addLeadEvent(leadId, { type, comment });
    setType("");
    setComment("");
    load();
  };

  return (
    <div>
      <h3>Events</h3>

      <input
        placeholder="Type"
        value={type}
        onChange={e => setType(e.target.value)}
      />

      <input
        placeholder="Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={submit}>Add Event</button>

      {events.map(e => (
        <p key={e.id}>
          <b>{e.type}</b> – {e.comment}
        </p>
      ))}
    </div>
  );
}