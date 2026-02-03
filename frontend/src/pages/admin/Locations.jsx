// src/admin/Locations.jsx
import { useEffect, useState } from "react";
import { getLocations } from "../../api/admin/adminApi.js";
import DataTable from "../../components/admin/tables/DataTable";

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getLocations().then((res) => setLocations(res.data));
  }, []);

  const columns = [
    { key: "name", label: "Location" },
    { key: "city", label: "City" },
  ];

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Locations</h1>
      <DataTable columns={columns} data={locations} />
    </>
  );
}
