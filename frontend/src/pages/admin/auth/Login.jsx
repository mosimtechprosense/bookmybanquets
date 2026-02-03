import { useState } from "react"
import { useNavigate } from "react-router-dom"
import adminApi, { loginWithPassword } from "../../../api/admin/adminApi.js"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // inline error
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Validate password
      const res = await loginWithPassword(email, password)

      if (res.data.admin) {
        // Request OTP from backend
        await adminApi.post("/auth/login", { email })
        navigate("/admin/verify-otp", { state: { email } })
      } else {
        // Normal user
        localStorage.setItem("user_token", res.data.token)
        navigate("/user/dashboard")
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 px-4 animate-fadeInSmooth">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fadeInSmooth">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          BookMyBanquets
        </h1>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-1 left-3 bg-white px-1 text-sm text-gray-500 font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition"
              required
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-1 left-3 bg-white px-1 text-sm text-gray-500 font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#dc2626] text-white font-semibold py-2 rounded-md transition-all ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#b91c1c] cursor-pointer"
            }`}
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {/* Reset password link */}
        <div className="flex justify-center items-center gap-2 mt-4 text-sm">
          <span className="text-gray-500"> Enter your credentials to login</span>
          <span
            className="text-[#dc2626] cursor-pointer hover:underline"
            onClick={() => navigate("/admin/reset-password")}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  )
}