import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let endpoint;
      let body;

      if (isAdmin) {
        // 🟢 Pakai kredensial admin default
        endpoint = "http://localhost:5000/api/admin/login";
        body = {
          username: "adminjohn",
          password: "admin1234",
        };
      } else {
        endpoint = "http://localhost:5000/api/users/login";
        body = { username, password };
      }

      const response = await axios.post(endpoint, body);

      const { token, role: backendRole } = response.data;
      const role = backendRole || (isAdmin ? "admin" : "user");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setLoading(false);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Login gagal. Periksa username & password."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-[850px] flex overflow-hidden">
        {/* Bagian kiri */}
        <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold text-[#7C6A46] mb-2">
            Puri Indah
          </h1>
          <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">
            Hotel
          </p>
        </div>

        {/* Form login */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
                required={!isAdmin} // ❌ Hanya required kalau user biasa
                disabled={isAdmin} // 🟢 Dinonaktifkan kalau login admin
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
                required={!isAdmin} // ❌ Hanya required kalau user biasa
                disabled={isAdmin} // 🟢 Dinonaktifkan kalau login admin
              />
            </div>

            {/* Checkbox login as admin */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label className="text-gray-600 text-sm">Login as Admin</label>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C6A46] text-white py-2 rounded-md hover:bg-[#7A634A] transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#7C6A46] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
