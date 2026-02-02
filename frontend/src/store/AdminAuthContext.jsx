import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // Load token from localStorage on page reload
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAdmin({
          token,
          role: payload.role,
          full_access: payload.full_access || false,
        });
      } catch {
        // Invalid token
        localStorage.removeItem("admin_token");
      }
    }
  }, [navigate]);

  // Save token + role + full_access after login
  const login = (data) => {
    localStorage.setItem("admin_token", data.token);
    setAdmin({
      token: data.token,
      role: data.role,
      full_access: data.full_access || false,
    });

    // Redirect after login
    if (data.role === "SUPER_ADMIN" || data.role === "ADMIN") {
      navigate("/admin/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
