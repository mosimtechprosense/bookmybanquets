import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin/adminApi.js";
import StatCard from "../../components/admin/cards/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setStats({}); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load dashboard stats
      </div>
    );
  }

  

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Listings" value={stats.listings || 0} color="bg-blue-500" />
      <StatCard title="Leads" value={stats.leads || 0} color="bg-teal-500" />
      <StatCard title="Bookings" value={stats.bookings || 0} color="bg-green-500" />
      <StatCard title="Cities" value={stats.cities || 0} color="bg-purple-500" />
    </div>
  );
}
