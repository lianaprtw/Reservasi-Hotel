import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const BookingStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data dari BookingStep1
  const booking = location.state || {};

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cek booking saat komponen pertama kali di-render
  useEffect(() => {
    if (!booking || (!booking.id && !booking._id)) {
      alert("Booking data not found! Redirecting to Step 1.");
      navigate("/booking");
    }
  }, [booking, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert("Please complete all payment fields.");
      return;
    }

    const bookingId = booking.id || booking._id;
    if (!bookingId) {
      alert("Booking ID not found!");
      return;
    }

    const paymentData = {
      bookingId,
      paymentMethod: "credit_card",
      cardDetails: { cardName, cardNumber, expiry, cvv },
      amount: booking.total, 
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:3002/api/payment/pay",
        paymentData
      );
      console.log("Payment response:", response.data);

      alert("✅ Payment Successful!");
      navigate("/booking-success", { state: { ...booking, payment: response.data } });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("❌ Payment failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-10 px-5">
        <h2 className="text-2xl font-bold text-[#7C6A46] mb-2">Payment</h2>
        <p className="text-gray-400 mb-10 text-center">
          Complete your booking by making a payment
        </p>

        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[800px] gap-8">
          {/* Booking summary */}
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

          {/* Payment form */}
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
                disabled={isSubmitting}
                className={`py-2 rounded-md font-medium ${
                  isSubmitting ? "bg-gray-400" : "bg-[#7C6A46] hover:bg-[#7A5232] text-white"
                }`}
              >
                {isSubmitting ? "Processing..." : `Pay $${booking.total} USD`}
              </button>

              <button
                type="button"
                onClick={() => navigate("/booking", { state: { ...booking } })}
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
