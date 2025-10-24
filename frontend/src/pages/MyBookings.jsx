import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
import roomImage from "../assets/room1.png";
import { useNavigate } from "react-router-dom";

const MyBooking = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      roomName: "The Royal Room",
      dateRange: "20 Jan - 22 Jan",
      price: "Rp 1.200.000",
      image: roomImage,
    },
    {
      id: 2,
      roomName: "Deluxe Suite",
      dateRange: "10 Feb - 12 Feb",
      price: "Rp 1.800.000",
      image: roomImage,
    },
  ]);
  const navigate = useNavigate();

  const handleToggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleViewDetail = (id) => {
    navigate(`/booking-detail/${id}`);
  };

  const handleCancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      // Hapus dari daftar booking
      setBookings((prevBookings) => prevBookings.filter((b) => b.id !== id));
      alert("Booking successfully cancelled!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 px-20 py-10 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">My Booking</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            You have no active bookings.
          </p>
        ) : (
          <div className="flex flex-col space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="relative flex items-center justify-between border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
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
                    onClick={() => handleToggleDropdown(booking.id)}
                  >
                    <FaEllipsisV size={18} />
                  </button>

                  {/* Dropdown */}
                  {openDropdown === booking.id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-10">
                      <button
                        onClick={() => handleViewDetail(booking.id)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Detail Booking
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
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
