import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCalendarAlt, FaUser, FaDoorOpen, FaMapMarkerAlt } from "react-icons/fa";
import roomImage from "../assets/room1.png"; // ganti dengan gambar yang sesuai

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data contoh (nantinya bisa diganti fetch dari API)
  const booking = {
    id,
    roomName: "The Royal Room",
    location: "Puri Indah Hotel, Kuta, Bali",
    checkIn: "20 Jan 2025",
    checkOut: "22 Jan 2025",
    guests: 2,
    roomType: "Luxury Suite",
    price: "Rp 1.200.000 / malam",
    total: "Rp 2.400.000",
    status: "Confirmed",
    image: roomImage,
  };

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
              <p className="text-gray-500 text-sm">Price</p>
              <p className="font-semibold text-gray-800">{booking.price}</p>

              <p className="text-gray-500 text-sm mt-3">Total Payment</p>
              <p className="text-2xl font-bold text-amber-700">{booking.total}</p>

              <div className="mt-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
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
