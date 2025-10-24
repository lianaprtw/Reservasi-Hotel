import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // State untuk input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Simulasi proses register berhasil
    alert("Registration successful! Please login.");
    navigate("/login"); // arahkan ke halaman login
  };

  // Tombol aktif jika semua input terisi
  const isFormValid =
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    country.trim() &&
    password.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-[850px] flex overflow-hidden">
        {/* Bagian Kiri */}
        <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold text-[#7C6A46] mb-2">
            Puri Indah
          </h1>
          <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">
            Hotel
          </p>
        </div>

        {/* Bagian Kanan (Form) */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone No
              </label>
              <input
                type="text"
                placeholder="With Country Code"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="Country Name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-coffee"
              />
            </div>

            <p className="text-xs text-gray-500">
              By signing up you agree to our{" "}
              <span className="text-coffee font-medium">
                terms and conditions
              </span>
              .
            </p>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 rounded-md transition ${
                isFormValid
                  ? "bg-[#7C6A46] text-white hover:bg-[#7A634A]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-coffee font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
