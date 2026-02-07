import { useState } from "react";

export default function ResetPasswordModal({ user, onClose, onReset }) {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[420px] p-6 space-y-5 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold text-orange-600">
            Reset User Password
          </h2>
          <p className="text-sm text-gray-500">
            This will immediately invalidate the old password
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
          <strong>User:</strong> {user.email}
        </div>

        <div>
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onReset(password)}
            disabled={!password}
            className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
