import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BookingStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data dari BookingStep1
  const booking = location.state || {}; // fallback jika state kosong

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    alert("Payment successful!");
    navigate("/booking-success", { state: booking });
  };

  if (!booking.roomName) {
    // jika data tidak ada, redirect ke BookingStep1
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">No booking data found. Redirecting...</p>
        <button
          onClick={() => navigate("/booking")}
          className="mt-4 px-4 py-2 bg-[#7C6A46] text-white rounded-md"
        >
          Go to Booking Step 1
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-10 px-5">
        <h2 className="text-2xl font-bold text-[#7C6A46] mb-2">Payment</h2>
        <p className="text-gray-400 mb-10 text-center">
          Complete your booking by making a payment
        </p>

        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[800px] gap-8">
          {/* Left side - Booking summary */}
          <div className="flex flex-col md:w-1/2 border-r pr-5 mb-5 md:mb-0">
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
          </div>

          {/* Right side - Payment form */}
          <div className="flex flex-col md:w-1/2">
            <form onSubmit={handlePayment} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="border px-3 py-2 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="border px-3 py-2 rounded-md"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border px-3 py-2 rounded-md w-1/2"
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border px-3 py-2 rounded-md w-1/2"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#7C6A46] text-white py-2 rounded-md font-medium hover:bg-[#7A5232]"
              >
                Pay ${booking.total} USD
              </button>
              <button
                type="button"
                onClick={() => 
                  navigate("/booking",
                    { state: {
                      id: booking.id,
                      roomName: booking.roomName,
                      price: booking.price
                    },
                  })
              }
                className="bg-gray-100 text-gray-400 py-2 rounded-md font-medium hover:bg-gray-200 hover:text-[#7A5232] transition duration-300"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingStep2;
