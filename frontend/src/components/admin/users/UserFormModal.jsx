import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../../api/admin/adminApi.js";

export default function UserFormModal({ editingUser, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "DATA_ENTRY_USER",
    is_active: true,
  });

  useEffect(() => {
    setForm({
      name: editingUser?.name || "",
      email: editingUser?.email || "",
      password: "",
      role: editingUser?.role || "DATA_ENTRY_USER",
      is_active: editingUser?.is_active ?? true,
    });
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      is_active: form.is_active,
    };

    try {
      if (!editingUser) {
        payload.password = form.password;
        await createUser(payload);
      } else {
        await updateUser(editingUser.id, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-[420px] p-8 space-y-6 shadow-2xl animate-fadeInSmooth"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {editingUser ? "Edit User" : "Create User"}
        </h2>

        {/* Name */}
        <div className="relative">
          <label className="absolute top-0.5 left-3 bg-white px-1 text-sm text-gray-500 font-semibold">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="absolute top-0.5 left-3 bg-white px-1 text-sm text-gray-500 font-semibold">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Password only on create */}
        {!editingUser && (
          <div className="relative">
            <label className="absolute top-0.5 left-3 bg-white px-1 text-sm text-gray-500 font-semibold">
              Initial Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        )}

        {/* Role */}
        <div className="relative">
          <label className="absolute top-0.5 left-3 bg-white px-1 text-sm text-gray-500 font-semibold">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="ADMIN">Admin</option>
            <option value="LEAD_USER">Lead User</option>
            <option value="DATA_ENTRY_USER">Data Entry User</option>
            <option value="VENUE_MANAGER">Venue Manager</option>
          </select>
        </div>

        {/* Active */}
        <label className="flex items-center gap-2 text-sm text-gray-700 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="cursor-pointer"
          />
          Active User
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-400 rounded-xl hover:bg-gray-50 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}