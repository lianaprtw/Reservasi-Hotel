import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // 🟢 Import axios untuk koneksi ke backend

const Register = () => {
  const navigate = useNavigate();

  // 🧩 State untuk menyimpan input user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Fungsi ketika user menekan tombol Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔗 Kirim data ke backend
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          phone,
          country,
          password,
        }
      );

      if (response.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login"); // 🔀 Arahkan ke halaman login
      }
    } catch (err) {
      // ❌ Jika error dari backend
      if (err.response) {
        setError(
          err.response.data.message || "Registration failed. Try again."
        );
      } else {
        // ⚠️ Jika server tidak bisa dihubungi
        setError("Cannot connect to server. Please check backend.");
      }
    } finally {
      setLoading(false);
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

        {/* Bagian kanan (form register) */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleRegister}>
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone No
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="With Country Code"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country Name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
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
                placeholder="Min. 6 characters"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7C6A46]"
                required
              />
            </div>

            {/* Pesan error kalau gagal */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <p className="text-xs text-gray-500">
              By signing up you agree to our{" "}
              <span className="text-[#7C6A46] font-medium">
                terms and conditions
              </span>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C6A46] text-white py-2 rounded-md hover:bg-[#7A634A] transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7C6A46] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
