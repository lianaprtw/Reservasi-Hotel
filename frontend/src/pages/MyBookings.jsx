import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
import roomImage from "../assets/room1.png"; // Fallback image
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyBooking = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State untuk error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 1. Ambil token (sesuai localStorage Anda)
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Silakan login untuk melihat riwayat booking Anda.");
          navigate("/login");
          return;
        }

        // 2. Siapkan config header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // ======================================================
        // 3. INI PERBAIKANNYA: Panggil URL yang BENAR
        const response = await axios.get("http://localhost:3001/api/bookings/mybookings", config);
        // ======================================================

        // 4. Hapus filter frontend, karena backend sudah memfilter
        const data = response.data.map(b => ({
          ...b,
          _id: b._id, 
          image: b.image || roomImage,
          dateRange: `${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`,
          price: b.total ? `$${b.total}` : "Rp 0",
        }));
        
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err.response?.data || err.message);
        setError("Gagal memuat booking. Coba refresh halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]); // Tambahkan navigate sebagai dependensi

  const handleToggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleViewDetail = (id) => {
    navigate(`/booking-detail/${id}`);
  };

  const handleCancelBooking = async (id) => {
    // Pastikan menggunakan window.confirm
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        // Ambil token lagi
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("Sesi Anda berakhir. Silakan login kembali.");
          navigate("/login");
          return;
        }

        // Siapkan config header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Kirim request delete dengan config
        await axios.delete(`http://localhost:3001/api/bookings/${id}`, config);
        
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Booking successfully cancelled!");
      } catch (err) {
        console.error("Failed to cancel booking:", err.response?.data || err.message);
        alert("Gagal membatalkan booking.");
      }
    }
  };

  // ... sisa JSX Anda (sudah benar) ...
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 px-4 sm:px-10 md:px-20 py-10 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">My Booking</h2>

        {error && <p className="text-center text-red-500 mt-10">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading bookings...</p>
        ) : !error && bookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">You have no active bookings.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <img
                    src={booking.image}
                    alt={booking.roomName}
                    className="w-36 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.roomName}
                    </h3>
                    <div className="flex items-center text-gray-500 mt-1">
                      <FaCalendarAlt className="mr-2 text-amber-600" />
                      <span>{booking.dateRange}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 relative">
                  <p className="text-lg font-semibold text-gray-800">
                    {booking.price}
                  </p>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => handleToggleDropdown(booking._id)}
                  >
                    <FaEllipsisV size={18} />
                  </button>
                  {openDropdown === booking._id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-10">
                      <button
                        onClick={() => handleViewDetail(booking._id)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Detail Booking
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBooking;

