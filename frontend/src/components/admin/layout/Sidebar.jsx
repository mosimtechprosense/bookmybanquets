import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaTasks,
  FaList,
  FaChevronDown
} from "react-icons/fa";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
  {
    name: "User Management",
    icon: <FaUsers />,
    children: [
      { name: "Users", path: "/admin/users" },
      { name: "Permissions", path: "/admin/permissions" }
    ]
  },
  {
    name: "Task Management",
    icon: <FaTasks />,
    children: [
      { name: "Leads", path: "/admin/leads" },
      { name: "All Tasks", path: "/admin/tasks" }
    ]
  },
  { name: "Listings", path: "/admin/listings", icon: <FaList /> }
];

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const parent = menu.find(m =>
      m.children?.some(c => location.pathname.startsWith(c.path))
    );
    if (parent) setOpenMenu(parent.name);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <aside
      className={`
        ${collapsed ? "w-16" : "w-64"}
        transition-all duration-300
        bg-gray-800 text-white
        flex flex-col justify-between
      `}
    >
      {/* Logo */}
      <div>
        <div className="p-4 font-bold text-lg text-center whitespace-nowrap">
          {!collapsed && "BookMyBanquets"}
        </div>

        {/* Menu */}
        {menu.map(item => {
          if (item.children) {
            const isOpen = openMenu === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    !collapsed &&
                    setOpenMenu(isOpen ? null : item.name)
                  }
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && (
                      <span className="whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <FaChevronDown
                      className={`transition-transform ml-5 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Children */}
                {!collapsed && isOpen &&
                  item.children.map(child => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `block pl-12 py-2 text-sm hover:bg-gray-700 whitespace-nowrap ${
                          isActive ? "bg-gray-700" : ""
                        }`
                      }
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
              className={({ isActive }) =>
                `px-4 py-2 flex items-center gap-3 hover:bg-gray-700 whitespace-nowrap ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && item.name}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm whitespace-nowrap"
      >
        {!collapsed ? "Logout" : "⎋"}
      </button>
    </aside>
  );
}
