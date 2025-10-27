import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("🆔 ID dari URL:", id);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Ambil data kamar dari backend
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/rooms/${id}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        console.error("❌ Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-20">Loading room details...</p>
    );

  if (!room)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Room not found</h2>
        <button
          onClick={() => navigate("/rooms")}
          className="bg-[#7A634A] text-white px-6 py-3 rounded-md hover:bg-[#6b553f]"
        >
          Back to Rooms
        </button>
      </div>
    );

  // ✅ Fasilitas statis (bisa kamu ubah sesuai backend nanti)
  const facilities = [
    { icon: "🛏️", label: "1 bedroom" },
    { icon: "🛋️", label: "1 living room" },
    { icon: "🚿", label: "1 bathroom" },
    { icon: "🍽️", label: "1 dining room" },
    { icon: "📶", label: "10 mbp/s Wi-Fi" },
    { icon: "📺", label: "2 television" },
  ];

  const handleBookNow = () => {
    navigate("/booking", {
      state: { id: room._id, roomName: room.name, price: room.price },
    });
  };

  return (
    <div className="bg-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-center mb-10 text-gray-900">
          {room.name}
        </h1>

        {/* ✅ Gambar utama */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <img
            src={
              room.image ||
              "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=60"
            }
            alt={room.name}
            className="w-full h-80 object-cover rounded-xl col-span-2"
          />
          <div className="grid gap-4">
            <img
              src={
                room.image ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60"
              }
              alt="Room"
              className="w-full h-38 object-cover rounded-xl"
            />
            <img
              src={
                room.image ||
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60"
              }
              alt="Room"
              className="w-full h-38 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* ✅ Deskripsi & Harga */}
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              About the place
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {room.description || "No description available for this room."}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-2">Start Booking</p>
            <p className="text-3xl font-bold text-emerald-600 mb-4">
              ${room.price}
              <span className="text-gray-400 text-lg font-normal"> / day</span>
            </p>

            {room.available.toLowerCase().trim() === "yes" &&
            room.capacity > 0 ? (
              <button
                onClick={handleBookNow}
                className="w-full bg-[#7A634A] text-white py-3 rounded-md hover:bg-[#6b553f] transition"
              >
                Book Now!
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-md cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </div>
        </div>

        {/* ✅ Fasilitas */}
        <div className="flex flex-wrap justify-between mt-14 border-t pt-8 text-gray-700">
          {facilities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm md:text-base mb-3"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoomDetail;
