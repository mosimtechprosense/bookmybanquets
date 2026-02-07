import { useEffect, useState } from "react"
import { getUsers, deleteUser, adminResetPassword } from "../../api/admin/adminApi.js"
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import DataTable from "../../components/admin/tables/DataTable"
import UserFormModal from "../../components/admin/users/UserFormModal.jsx"
import ResetPasswordModal from "../../components/admin/users/ResetPasswordModal.jsx"

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [resetUser, setResetUser] = useState(null)

  const fetchUsers = async () => {
    const res = await getUsers()
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const removeUser = async (id) => {
    if (confirm("Delete user?")) {
      await deleteUser(id)
      fetchUsers()
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`font-semibold text-xs text-white py-0.5 px-1 rounded ${
            row.is_active ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {row.is_active ? "Active" : "InActive"}
        </span>
      )
    }
  ]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Users</h1>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowForm(true)
          }}
          className="px-4 py-1.5 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-600"
        >
          Add New User
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        actions={(row) => (
          <div className="flex items-center gap-3 font-medium">
            <button
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => {
                setEditingUser(row)
                setShowForm(true)
              }}
            >
              <FaEdit className="h-5 w-5 " />
            </button>
            <button
              className="text-red-600 cursor-pointer"
              onClick={() => removeUser(row.id)}
            >
              <MdDeleteForever className="h-6 w-6" />
            </button>
              <button
              className="text-green-600 cursor-pointer"
              onClick={() => setResetUser(row)}
            >
              Reset Password
            </button>
          </div>
        )}
      />

      {showForm && (
        <UserFormModal
          editingUser={editingUser}
          onClose={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
          onSaved={fetchUsers}
        />
      )}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onReset={async (password) => {
            try {
              await adminResetPassword(resetUser.id, password)
              setResetUser(null)
              alert("Password reset successfully")
            } catch (err) {
              console.error(err)
              alert(err.response?.data?.message || "Failed to reset password")
            }
          }}
        />
      )}
    </>
  )
}