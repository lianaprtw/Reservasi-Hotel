import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // <-- Tambah axios
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import roomImg from "../assets/room.png";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingStep1 = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000));
  const [days, setDays] = useState(1);
  const pricePerDay = 200;
  const [total, setTotal] = useState(pricePerDay);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const calculatedDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDays(calculatedDays > 0 ? calculatedDays : 1);
    setTotal((calculatedDays > 0 ? calculatedDays : 1) * pricePerDay);
  }, [startDate, endDate]);

  const handleBookNow = async () => {
    setLoading(true);
    try {
      const bookingData = {
        user_id: 1,       // sementara hardcode
        room_id: 101,     // sementara hardcode
        total_amount: total
      };

      const response = await axios.post('http://localhost:3001/booking', bookingData);
      const createdBooking = response.data.booking;

      // Setelah sukses, navigate ke step2
      navigate("/booking-step2", {
        state: {
          bookingId: createdBooking._id,
          roomName: "The Royal Room",
          checkIn: startDate.toISOString().split("T")[0],
          checkOut: endDate.toISOString().split("T")[0],
          days: days,
          total: total,
          status: createdBooking.status
        },
      });

    } catch (error) {
      alert("Gagal melakukan booking: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-10 px-5">
        <h2 className="text-2xl font-bold text-[#9C6644] mb-2">Booking Information</h2>
        <p className="text-gray-400 mb-10 text-center">Please fill up the blank fields below</p>

        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[800px] gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img src={roomImg} alt="The Royal Room" className="rounded-lg w-[320px] h-[200px] object-cover mb-3" />
            <h3 className="font-semibold text-[#9C6644] text-lg">The Royal Room</h3>
            <p className="text-gray-400 text-sm">Galle, Sri Lanka</p>
          </div>

          <div className="flex flex-col justify-between w-full md:w-[50%]">
            <div>
              <p className="text-gray-700 font-medium mb-2">Pick Start Date</p>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md mb-5">
                <FaCalendarAlt className="text-[#9C6644]" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  className="bg-gray-100 text-gray-600 w-full"
                />
              </div>

              <p className="text-gray-700 font-medium mb-2">Pick End Date</p>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md mb-5">
                <FaCalendarAlt className="text-[#9C6644]" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="bg-gray-100 text-gray-600 w-full"
                />
              </div>

              <p className="text-gray-400">
                You will pay{" "}
                <span className="text-[#9C6644] font-semibold">${total} USD</span>{" "}
                for <span className="font-semibold text-[#9C6644]">{days} Days</span>
              </p>
            </div>

            <div className="flex flex-col mt-8">
              <button
                onClick={handleBookNow}
                className="bg-[#9C6644] text-white py-2 rounded-md font-medium hover:bg-[#7A5232]"
                disabled={loading}
              >
                {loading ? "Processing..." : "Book Now"}
              </button>
              <button
                type="button"
                className="bg-gray-100 text-gray-400 py-2 rounded-md font-medium mt-3"
                onClick={() => navigate(-1)}
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
