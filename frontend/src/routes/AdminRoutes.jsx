import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/layout/AdminLayout";

import Login from "../pages/admin/auth/Login";
import VerifyOtp from "../pages/admin/auth/VerifyOtp";
import ResetPassword from "../pages/admin/auth/ResetPassword";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Listings from "../pages/admin/Listings";
import Leads from "../pages/admin/Leads";
import Bookings from "../pages/admin/Bookings";
import Locations from "../pages/admin/Locations";



const Protected = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;

  return children;
};



export default function AdminRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="login" element={<Login />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* Protected Admin */}
      <Route element={<Protected> <AdminLayout /> </Protected>}>
      


        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="listings" element={<Listings />} />        


        <Route path="bookings" element={<Bookings />} />
        <Route path="locations" element={<Locations />} />
        
    {/* Leads */}
    <Route path="leads" element={<Leads />} />

      </Route>
    </Routes>
  );
}
