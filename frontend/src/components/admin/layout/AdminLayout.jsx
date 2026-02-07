import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 bg-gray-100">
        <Header onToggle={() => setCollapsed(c => !c)} />
        <div className="p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
