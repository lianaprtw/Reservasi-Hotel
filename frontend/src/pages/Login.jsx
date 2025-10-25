import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// membuat komponen Login
const Login = () => {
  const navigate = useNavigate(); //berpindah halaman
  const [username, setUsername] = useState(""); //state untuk menyimpan username
  const [password, setPassword] = useState(""); //state untuk menyimpan password

  // fungsi saat tombol login di klik
  const handleLogin = (e) => {
    e.preventDefault(); //mencegah reload halaman saat form disubmit

    // Simulasi login berhasil (bisa diganti API)
    localStorage.setItem("token", "fake-token"); //menyimpan token palsu di localStorage agar bisa dipakai sebagia simulasi autentikasi
    navigate("/home"); //arahkan ke halaman home
  };

  // Tombol aktif jika username & password tidak kosong
  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-[850px] flex overflow-hidden">
        <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold text-[#7C6A46] mb-2">Puri Indah</h1>
          <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">Hotel</p>
        </div>

        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

          {/* form login */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
              {/* input username */}
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              {/* input password */}
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            {/* tombol login */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 rounded-md transition 
                ${isFormValid ? "bg-[#7C6A46] text-white hover:bg-[#7A634A]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Login
            </button>
          </form>

          {/* tautan ke halaman register */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-coffee font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
