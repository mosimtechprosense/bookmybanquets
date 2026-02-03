import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },

  {
    name: "User Management",
    children: [
      { name: "Users", path: "/admin/users" },
      { name: "Permissions", path: "/admin/permissions" },
    ],
  },
  {
  name: "Task Management",
  children: [
    { name: "Leads", path: "/admin/leads" },
    { name: "All Tasks", path: "/admin/tasks" }
  ]
}
,
  { name: "Listings", path: "/admin/listings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <div className="p-4 font-bold text-xl">Admin Panel</div>

        {menu.map((item, idx) => {
          if (item.children) {
            return (
              <div key={idx}>
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between cursor-pointer"
                >
                  {item.name}
                  <span>{open === idx ? "▲" : "▼"}</span>
                </button>

                {open === idx &&
                  item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className="block pl-8 py-2 text-sm hover:bg-gray-700"
                    >
                      {child.name}
                    </NavLink>
                  ))}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="m-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
      >
        Logout
      </button>
    </aside>
  );
}
