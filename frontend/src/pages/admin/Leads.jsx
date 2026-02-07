import { useCallback, useEffect, useState } from "react";
import { fetchLeads } from "../../api/admin/lead.api";
import {
  FaEdit,
  FaUsers,
  FaChevronDown 
} from "react-icons/fa";
import DataTable from "../../components/admin/tables/DataTable";
import LeadFormModal from "../../components/admin/leads/LeadFormModal";
import RMNotes from "../../components/admin/leads/RMNotes";
import LeadEvents from "../../components/admin/leads/LeadEvents";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
const [editingLead, setEditingLead] = useState(null);
const [showRMNotes, setShowRMNotes] = useState(false);
const [showEvents, setShowEvents] = useState(false);
const [selectedLeadId, setSelectedLeadId] = useState(null);


  const loadData = useCallback(async () => {
    const res = await fetchLeads({ page, limit, search });
    setLeads(
  res.data.data.map(l => ({
    ...l,
    slot: l.slot ? l.slot.split(",") : [],
    menu: l.menu ? l.menu.split(",") : []
  }))
);
    setTotalPages(res.data.totalPages);
  }, [page, limit, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  const columns = [
    {
      key: "created_at",
      label: "Date",
render: row => {
  if (!row.created_at) return "";
  const d = new Date(row.created_at);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
    },
    {
      key: "assign",
      label: "Assign Tasks",
      render: () => (
        <FaUsers className="text-yellow-500 flex  text-lg cursor-pointer" />
      )
    },
    {
      key: "action",
      label: "Action",
      render: row => (
        <FaEdit
          className="text-blue-500 text-lg cursor-pointer"
           onClick={() => {
        setEditingLead(row);
        setShowForm(true);
      }}
        />
      )
    },
   {
  key: "rm",
  label: "RM Notes",
  render: row => (
    <button
      onClick={() => {
        setSelectedLeadId(row.id);
        setShowRMNotes(true);
      }}
      className="px-2 py-1 text-xs bg-cyan-600 text-white rounded cursor-pointer"
    >
      RM Notes
    </button>
  )
},
{
  key: "events",
  label: "Events",
  render: row => (
    <button
      onClick={() => {
        setSelectedLeadId(row.id);
        setShowEvents(true);
      }}
      className="px-2 py-1 text-xs bg-green-600 text-white rounded cursor-pointer"
    >
      Events
    </button>
  )
},
    { key: "inquiry_for", label: "Inquiry For" },
    { key: "manager", label: "Manager" },
    { key: "source", label: "Source" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "preferred_location", label: "Preferred Location" },
    { key: "no_guest", label: "Guests" },
{
  key: "event_date",
  label: "Event Date",
  render: row => {
    if (!row.event_date) return "";
    const [year, month, day] = row.event_date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }
},
{
  key: "slot",
  label: "Slot",
  render: row => row.slot.join(", ") || ""
},
{
  key: "menu",
  label: "Menu",
  render: row => row.menu.join(", ") || ""
},
    { key: "event_type", label: "Event Type" },
    { key: "budget", label: "Budget" }
  ];


  // pagination
  const visiblePages = 10;
const startPage =
  Math.floor((page - 1) / visiblePages) * visiblePages + 1;
const endPage = Math.min(startPage + visiblePages - 1, totalPages);


  return (
    <>
      {/* Header */}
      <div className="flex justify-between mr-[57rem] items-center mb-4">
        <h1 className="text-xl font-bold">Inquiry Leads</h1>
              <button
  onClick={() => {
  setEditingLead(null);
  setShowForm(true)}}
  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-cyan-800"
>
   Add New Lead
</button>
      </div>




      {/* Controls ABOVE table */}
<div className="mb-4">
  <div className="flex justify-between items-center">

    {/* Show entries - LEFT aligned under search */}
    <div className="flex justify-start items-center gap-2 text-sm px-2">
      <span className="text-gray-600">Show</span>

<div className="relative">
  <select
    value={limit}
    onChange={e => {
      setPage(1);
      setLimit(+e.target.value);
    }}
    className="
      appearance-none
      px-3 py-1.5 pr-8
      border border-gray-300
      rounded-md
      bg-white
      shadow-sm
      cursor-pointer
      focus:outline-none
      focus:ring-2
      focus:ring-cyan-500
    "
  >
    {[10, 25, 50, 100].map(v => (
      <option key={v} value={v}>{v}</option>
    ))}
  </select>

  <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
</div>


      <span className="text-gray-600">entries</span>
    </div>

    {/* SEARCH – exact red-mark position */}
    <div className="flex justify-center flex-1 mr-52">
      <input
        type="text"
        placeholder="Search by name or number..."
        value={search}
        onChange={e => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="
          w-[210px]
          px-4 py-2
          border border-gray-300
          rounded-lg
          text-sm
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500
        "
      />
    </div>

  </div>
</div>




      {/* Table */}
      <DataTable columns={columns} data={leads} />

{/* Pagination BELOW table */}
<div className="flex justify-start ml-50 mt-10 px-4">
  <div className="flex items-center gap-1">

    <button
      disabled={page === 1}
      onClick={() => setPage(p => p - 1)}
      className="px-3 py-1 border border-gray-300 rounded bg-white disabled:opacity-40 cursor-pointer hover:bg-gray-100"
    >
      Prev
    </button>

{Array.from(
  { length: endPage - startPage + 1 },
  (_, i) => startPage + i
).map(pageNo => (
  <button
    key={pageNo}
    onClick={() => setPage(pageNo)}
    className={`px-3 py-1 border rounded
      ${
        page === pageNo
          ? "bg-cyan-700 text-white border-cyan-700"
          : "bg-white border-gray-300 hover:bg-gray-100 cursor-pointer"
      }`}
  >
    {pageNo}
  </button>
))}


    <button
      disabled={page === totalPages}
      onClick={() => setPage(p => p + 1)}
      className="px-3 py-1 border border-gray-300 rounded bg-white disabled:opacity-40 cursor-pointer hover:bg-gray-100"
    >
      Next
    </button>

  </div>
</div>

{showForm && (
<LeadFormModal
  editingLead={editingLead}
  onClose={() => {
    setShowForm(false);
    setEditingLead(null);
    setShowRMNotes(false);
    setShowEvents(false);
  }}
  onSaved={loadData}
  open={showForm}
>
</LeadFormModal>
)}

{/* RM Notes */}
{showRMNotes && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setShowRMNotes(false)}
  >
  <RMNotes leadId={selectedLeadId} close={() => setShowRMNotes(false)}/>
  </div>
)}

{/* Lead Events */}
{showEvents && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setShowEvents(false)}
  >
    <LeadEvents leadId={selectedLeadId} close={() => setShowEvents(false)}
    />
  </div>
)}
    </>
  );
}
