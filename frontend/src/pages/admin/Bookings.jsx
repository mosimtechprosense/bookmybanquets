import { useEffect, useState } from "react";
import DataTable from "../../components/admin/tables/DataTable";
import adminApi from "../../api/admin/adminApi.js"

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    adminApi.get("/bookings").then((res) => setBookings(res.data));
  }, []);

  const columns = [
    { key: "id", label: "#" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
  ];

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Bookings</h1>
      <DataTable columns={columns} data={bookings} />
    </>
  );
}
