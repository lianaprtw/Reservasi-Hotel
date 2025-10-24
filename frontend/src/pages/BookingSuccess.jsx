import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCheckCircle } from "react-icons/fa";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || {};

  if (!booking.roomName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">No booking data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-[#7C6A46] text-white rounded-md"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center py-20 px-5">
        <FaCheckCircle className="text-green-500 text-8xl mb-6" />
        <h2 className="text-3xl font-bold text-[#7C6A46] mb-4">Booking Successful!</h2>
        <p className="text-gray-500 mb-10 text-center">
          Your booking has been completed successfully.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[500px] text-center">
          <h3 className="font-semibold text-[#7C6A46] text-lg mb-3">
            Booking Summary
          </h3>
          <p><span className="font-medium">Room:</span> {booking.roomName}</p>
          <p><span className="font-medium">Check-In:</span> {booking.checkIn}</p>
          <p><span className="font-medium">Check-Out:</span> {booking.checkOut}</p>
          <p><span className="font-medium">Days:</span> {booking.days}</p>
          <p className="text-[#7C6A46] font-semibold text-lg mt-3">
            Total: ${booking.total} USD
          </p>

          <button
            onClick={() => navigate("/home")}
            className="mt-6 bg-[#7C6A46] text-white py-2 px-4 rounded-md font-medium hover:bg-[#7A5232]"
          >
            Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingSuccess;
