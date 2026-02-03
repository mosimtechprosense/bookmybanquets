import { useEffect, useState } from "react";
import { fetchLeadById, updateLead } from "../../api/lead.api";
import { useParams } from "react-router-dom";
import RMNotes from "./RMNotes";
import LeadEvents from "./LeadEvents";

export default function EditLead() {
  const { id } = useParams();
  const [lead, setLead] = useState({});

  useEffect(() => {
    fetchLeadById(id).then(res => setLead(res.data));
  }, [id]);

  const save = async () => {
    await updateLead(id, lead);
    alert("Lead updated");
  };

  return (
    <div>
      <h2>Edit Lead</h2>

      <input
        placeholder="Name"
        value={lead.name || ""}
        onChange={e => setLead({ ...lead, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={lead.email || ""}
        onChange={e => setLead({ ...lead, email: e.target.value })}
      />

      <button onClick={save}>Save</button>

      <RMNotes leadId={id} />
      <LeadEvents leadId={id} />
    </div>
  );
}
