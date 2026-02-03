import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginOTP } from "../../../api/admin/adminApi.js";
import { useAdminAuth } from "../../../store/AdminAuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAdminAuth(); 

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/admin/login");
  }, [email, navigate]);

  const verify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await verifyLoginOTP(email, otp);

      if (!data?.token) throw new Error("Token not received");

      // ✅ Update context + localStorage + redirect
      login(data);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          BookMyBanquets
        </h1>

        <p className="text-gray-500 mb-4 text-center">
          Admin detected. Enter OTP sent to{" "}
          <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />

        <button
          onClick={verify}
          disabled={loading || !otp}
          className={`w-full py-3 rounded-md text-white font-semibold transition cursor-pointer ${
            loading || !otp
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p
          className="text-gray-400 mt-4 text-sm text-center cursor-pointer hover:underline"
          onClick={() => navigate("/admin/login")}
        >
          Back to login
        </p>
      </div>
    </div>
  );
}
