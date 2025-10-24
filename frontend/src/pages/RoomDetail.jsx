import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Data kamar
  const rooms = [
    {
      id: 1,
      name: "The Royal Room",
      price: 190,
      description:
        "Enjoy an elegant stay experience in The Royal Room with premium facilities and a calming atmosphere.",
      images: [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60",
      ],
    },
    {
      id: 2,
      name: "The Deluxe Suite",
      price: 150,
      description:
        "The Deluxe Suite offers extra comfort with a separate living room and a beautiful view.",
      images: [
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=60",
      ],
    },
    {
      id: 3,
      name: "The Ocean View",
      price: 220,
      description:
        "The Ocean View presents a stunning sea panorama with a modern and minimalist interior design.",
      images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",      ],
    },
  ];

  const room = rooms.find((r) => r.id === parseInt(id));

  if (!room) {
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
  }

  const facilities = [
    { icon: "🛏️", label: "1 bedroom" },
    { icon: "🛋️", label: "1 living room" },
    { icon: "🚿", label: "1 bathroom" },
    { icon: "🍽️", label: "1 dining room" },
    { icon: "📶", label: "10 mbp/s Wi-Fi" },
    { icon: "🏠", label: "7 unit ready" },
    { icon: "📺", label: "2 television" },
  ];

  const handleBookNow = () => {
    navigate("/booking", { 
      state: {
        id: room.id, 
        roomName: room.name, 
        price: room.price 
      } 
    });
  };

  return (
    <div className="bg-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-center mb-10 text-gray-900">
          {room.name}
        </h1>

        {/* Gambar utama + thumbnail */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <img
            src={room.images[0]}
            alt="Main room"
            className="w-full h-80 object-cover rounded-xl col-span-2"
          />
          <div className="grid gap-4">
            <img
              src={room.images[1]}
              alt="Room 2"
              className="w-full h-38 object-cover rounded-xl"
            />
            <img
              src={room.images[2]}
              alt="Room 3"
              className="w-full h-38 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Deskripsi dan harga */}
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              About the place
            </h2>
            <p className="text-gray-600 leading-relaxed">{room.description}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-2">Start Booking</p>
            <p className="text-3xl font-bold text-emerald-600 mb-4">
              ${room.price}
              <span className="text-gray-400 text-lg font-normal"> / day</span>
            </p>
            <button
              onClick={handleBookNow}
              className="w-full bg-[#7A634A] text-white py-3 rounded-md hover:bg-[#6b553f] transition"
            >
              Book Now!
            </button>
          </div>
        </div>

        {/* Fasilitas */}
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
