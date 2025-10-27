import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState("Guest");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // 🔹 Ambil data dari localStorage dan update secara realtime
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const savedName = localStorage.getItem("displayName");

    if (savedImage) setProfileImage(savedImage);
    if (savedName) setDisplayName(savedName);

    // Dengarkan perubahan localStorage (misalnya saat login/logout)
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem("displayName");
      const updatedImage = localStorage.getItem("profileImage");

      setDisplayName(updatedName || "Guest");
      setProfileImage(updatedImage);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Tutup dropdown kalau klik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔸 Logout: hapus semua data user & arahkan ke login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userData");
    localStorage.removeItem("profileImage");

    setDisplayName("Guest");
    setProfileImage(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center py-4 px-10 bg-white shadow-sm relative">
      {/* 🔹 Logo */}
      <div className="text-center cursor-pointer" onClick={() => navigate("/home")}>
        <h1 className="text-xl font-semibold text-[#6B4A2B]">Puri Indah</h1>
        <p className="text-xs text-gray-500 tracking-[0.2em]">HOTEL</p>
      </div>

      {/* 🔹 Menu navigasi */}
      <ul className="flex space-x-8 text-gray-700 font-medium">
        <li>
          <Link
            to="/home"
            className={`${
              isActive("/home")
                ? "text-[#6B4A2B] border-b-2 border-[#6B4A2B]"
                : "text-gray-700 hover:text-[#6B4A2B]"
            } pb-1 transition`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/rooms"
            className={`${
              isActive("/rooms")
                ? "text-[#6B4A2B] border-b-2 border-[#6B4A2B]"
                : "text-gray-700 hover:text-[#6B4A2B]"
            } pb-1 transition`}
          >
            Rooms
          </Link>
        </li>
      </ul>

      {/* 🔹 Profil Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={toggleDropdown}
          className="flex items-center space-x-2 cursor-pointer select-none"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <FaUserCircle className="text-3xl text-gray-500" />
          )}
          <span className="text-gray-700 font-medium">{displayName}</span>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-50">
            <Link
              to="/my-account"
              className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => setIsOpen(false)}
            >
              My Account
            </Link>
            <Link
              to="/my-booking"
              className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => setIsOpen(false)}
            >
              My Booking
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
