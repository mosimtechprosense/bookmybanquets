import { useState } from "react";
import { requestPasswordReset, resetPassword } from "../../../api/admin/adminApi.js";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- eye toggle

  const sendOtp = async () => {
    if (!form.email) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await requestPasswordReset(form.email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!form.otp || !form.newPassword) {
      setError("OTP and new password are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword(form);
      alert("Password reset successful");
      setStep(1);
      setForm({ email: "", otp: "", newPassword: "" });
      setShowPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 px-4 animate-fadeInSmooth">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fadeInSmooth">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h1>

        {error && <div className="mb-4 text-red-600 font-medium text-center">{error}</div>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className={`w-full bg-[#dc2626] text-white font-semibold py-2 rounded-md transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#b91c1c] cursor-pointer"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition"
            />
            
            {/* New Password with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className={`w-full bg-[#dc2626] text-white font-semibold py-2 rounded-md transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#b91c1c] cursor-pointer"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
