import { useEffect, useState } from "react";
import { fetchLeads } from "../../api/admin/lead.api";
import { useNavigate } from "react-router-dom";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads().then(res => setLeads(res.data));
  }, []);

  return (
    <div>
      <h2>Leads</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {leads.map(l => (
            <tr key={l.id}>
              <td>{l.name || "-"}</td>
              <td>{l.phone}</td>
              <td>{l.status}</td>
              <td>
                <button onClick={() => navigate(`/admin/leads/${l.id}`)}>
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
