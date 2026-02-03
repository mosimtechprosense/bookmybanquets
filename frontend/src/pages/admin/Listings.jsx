// src/admin/Listings.jsx
import { useEffect, useState } from "react";
import { getListings } from "../../api/admin/adminApi.js";
import DataTable from "../../components/admin/tables/DataTable";

export default function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getListings().then((res) => setListings(res.data));
  }, []);

  const columns = [
    { key: "name", label: "Listing Name" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Listings</h1>
      <DataTable columns={columns} data={listings} />
    </>
  );
}