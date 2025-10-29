import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import roomImg from "../assets/room.png"; // Fallback image
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Helper function untuk format tanggal (anti-timezone-bug)
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const BookingStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data kamar, termasuk 'image'
  const { id, roomName, price, image } = location.state || {};

  // Validasi data yang diterima
  useEffect(() => {
    if (!id || !roomName || !price) {
      alert(
        "❌ Data kamar tidak ditemukan. Silakan pilih kamar terlebih dahulu."
      );
      navigate("/rooms");
    }
  }, [id, roomName, price, navigate]);

  // State untuk tanggal dan perhitungan total
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [days, setDays] = useState(1);
  const [total, setTotal] = useState(price || 0);

  // Hitung total otomatis setiap tanggal berubah
  useEffect(() => {
    if (endDate <= startDate) {
      const newEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      setEndDate(newEndDate);
      return;
    }
    const timeDiff = endDate.getTime() - startDate.getTime();
    const calculatedDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const validDays = calculatedDays > 0 ? calculatedDays : 1;

    setDays(validDays);
    setTotal(validDays * (price || 0));
  }, [startDate, endDate, price]);

  // Logika agar endDate otomatis update jika startDate melewatinya
  useEffect(() => {
    if (startDate >= endDate) {
      const newEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      setEndDate(newEndDate);
    }
  }, [startDate]); // Hanya bergantung pada startDate

  // Fungsi handle booking (VERSI AMAN & KONSISTEN)
  const handleBookNow = () => {
    // Pastikan user login dulu
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Silakan login terlebih dahulu untuk memesan kamar.");
      navigate("/login");
      return;
    }

    // Data sementara untuk dikirim ke step 2
    const bookingPreview = {
      roomId: id,
      roomName,
      checkIn: formatDateLocal(startDate),
      checkOut: formatDateLocal(endDate),
      days,
      total,
    };

    // Kirim data ke step 2 tanpa buat booking di DB
    navigate("/booking-step2", { state: { ...bookingPreview } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-10 px-5">
        <h2 className="text-2xl font-bold text-[#7C6A46] mb-2">
          Booking Information
        </h2>
        <p className="text-gray-400 mb-10 text-center">
          Please fill up the blank fields below
        </p>

        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[800px] gap-8">
          {/* Left Side - Room Info */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={image || roomImg}
              alt={roomName || "Room"}
              className="rounded-lg w-[320px] h-[200px] object-cover mb-3"
            />
            <h3 className="font-semibold text-[#7C6A46] text-lg">{roomName}</h3>
            <p className="text-gray-500 mt-1">${price} / day</p>
          </div>

          {/* Right Side - Booking Details */}
          <div className="flex flex-col justify-between w-full md:w-[50%]">
            <div>
              <p className="text-gray-700 font-medium mb-2">Pick Start Date</p>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md mb-5">
                <FaCalendarAlt className="text-[#7C6A46]" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  className="bg-gray-100 text-gray-600 w-full outline-none"
                />
              </div>

              <p className="text-gray-700 font-medium mb-2">Pick End Date</p>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md mb-5">
                <FaCalendarAlt className="text-[#7C6A46]" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // min end date 1 hari setelah start
                  className="bg-gray-100 text-gray-600 w-full outline-none"
                />
              </div>

              <p className="text-gray-400">
                You will pay{" "}
                <span className="text-[#7C6A46] font-semibold">
                  ${total} USD
                </span>{" "}
                for{" "}
                <span className="font-semibold text-[#7C6A46]">
                  {days} Days
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col mt-8">
              <button
                onClick={handleBookNow}
                className="bg-[#7C6A46] text-white py-2 rounded-md font-medium hover:bg-[#6b553f] transition duration-300"
              >
                Book Now
              </button>

              <button
                type="button"
                onClick={() => navigate(id ? `/rooms/${id}` : "/rooms")}
                className="border border-gray-300 text-gray-500 py-2 rounded-md font-medium mt-3 hover:bg-gray-200 hover:text-[#7A5232] transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingStep1;
