import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulasi login berhasil (bisa diganti API)
    localStorage.setItem("token", "fake-token"); 
    navigate("/home");
  };

  // Tombol aktif jika email & password tidak kosong
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-[850px] flex overflow-hidden">
        <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold text-[#7C6A46] mb-2">Puri Indah</h1>
          <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">Hotel</p>
        </div>

        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 rounded-md transition 
                ${isFormValid ? "bg-[#7C6A46] text-white hover:bg-[#7A634A]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Login
            </button>
          </form>

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
