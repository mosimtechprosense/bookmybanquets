import { useEffect, useState } from "react";
import DataTable from "../../components/admin/tables/DataTable";
import { fetchLeads } from "../../api/admin/lead.api.js";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
   const navigate = useNavigate();


useEffect(() => {
  fetchLeads({ page: 1, limit: 50, search: "" })
  .then(res => setBookings(res.data.data));
}, []);


const columns = [
  { key: "created_at", label: "Date" },
  { key: "source", label: "Source" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "preferred_location", label: "Preferred Location" },
  { key: "no_guest", label: "No of Guests" },
  { key: "event_date", label: "Event Date" },
  { key: "slot", label: "Slot" },
  { key: "menu", label: "Menu" },
  { key: "event_type", label: "Event Type" },
  { key: "budget", label: "Budget" },
];


  return (
    <>
      <h1 className="text-xl font-bold mb-4">Bookings</h1>
      <DataTable
  columns={columns}
  data={bookings}
  actions={(row) => (
    <>
      <button onClick={() => navigate(`/admin/leads/${row.id}`)}>✏️</button>
    </>
  )}
/>

    </>
  );
}
