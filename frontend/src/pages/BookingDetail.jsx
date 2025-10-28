import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCalendarAlt, FaUser, FaDoorOpen, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import roomImage from "../assets/room1.png"; // Ganti dengan gambar default

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch booking berdasarkan ID
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/bookings/${id}`);
        const data = response.data;

        // Format data agar lebih mudah digunakan
        const formatted = {
          ...data,
          image: data.image || roomImage,
          checkIn: new Date(data.checkIn).toLocaleDateString(),
          checkOut: new Date(data.checkOut).toLocaleDateString(),
          price: data.total ? `Rp ${data.total.toLocaleString()}` : "Rp 0",
          location: data.location || "Lokasi tidak tersedia",
          guests: data.guests || 2,
          roomType: data.roomType || "Standard Room",
        };

        setBooking(formatted);
      } catch (error) {
        console.error("❌ Failed to fetch booking:", error);
        alert("Gagal memuat detail booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Booking tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 px-20 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-amber-600 mb-6 transition"
        >
          ← Back to My Booking
        </button>

        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Booking Detail</h2>

        <div className="flex space-x-10">
          {/* Gambar kamar */}
          <div className="w-1/2">
            <img
              src={booking.image}
              alt={booking.roomName}
              className="rounded-xl shadow-md w-full object-cover"
            />
          </div>

          {/* Detail booking */}
          <div className="w-1/2 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">{booking.roomName}</h3>
            <p className="text-gray-500 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-amber-600" /> {booking.location}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-500 text-sm">Check-in</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-amber-600" /> {booking.checkIn}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Check-out</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-amber-600" /> {booking.checkOut}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Guests</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <FaUser className="mr-2 text-amber-600" /> {booking.guests} persons
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Room Type</p>
                <p className="font-medium text-gray-800 flex items-center">
                  <FaDoorOpen className="mr-2 text-amber-600" /> {booking.roomType}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-gray-500 text-sm">Total Payment</p>
              <p className="text-2xl font-bold text-amber-700">{booking.price}</p>

              <div className="mt-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetail;
