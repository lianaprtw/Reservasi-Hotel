import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";

// Import gambar kamar
import room1Img from "../assets/room1.png";
import room2Img from "../assets/room2.png";
import room3Img from "../assets/room3.png";

const Rooms = () => {
  const navigate = useNavigate();

  // ✅ Data kamar (id unik dan beda-beda)
  const rooms = [
    {
      id: 1,
      title: "The Royal Room",
      price: "190",
      available: "Yes",
      image: room1Img,
    },
    {
      id: 2,
      title: "The Deluxe Suite",
      price: "150",
      available: "Yes",
      image: room2Img,
    },
    {
      id: 3,
      title: "The Ocean View",
      price: "220",
      available: "No",
      image: room3Img,
    },
  ];

  // ✅ Klik menuju halaman detail kamar
  const handleRoomClick = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${room1Img})` }}
      >
        <div className="bg-black/50 absolute inset-0"></div>
        <h1 className="text-4xl font-bold relative z-10">Rooms and Suites</h1>
        <p className="relative z-10 text-center w-2/3 mt-2 text-sm">
          The elegant luxury bedrooms in this gallery showcase custom interior
          designs & decorating ideas. View pictures and find your perfect luxury
          bedroom design.
        </p>
      </section>

      {/* Room Section */}
      <section className="px-20 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Available Rooms</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {rooms.map((room) => (
            <div key={room.id} onClick={() => handleRoomClick(room.id)}>
              <RoomCard {...room} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
