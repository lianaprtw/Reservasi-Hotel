import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { FaDollarSign } from "react-icons/fa";

// gambar lokal
import room1Img from "../assets/room1.png";
import room2Img from "../assets/room2.png";
import room3Img from "../assets/room3.png";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // ambil data dari backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/rooms");
        const data = await res.json();

        // tambahkan gambar lokal secara berurutan
        const images = [room1Img, room2Img, room3Img];
        const withImages = data.map((room, index) => ({
          ...room,
          image: images[index % images.length], // kalau lebih dari 3, akan berulang
        }));

        setRooms(withImages);
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomClick = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div>
      <Navbar />
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

      <section className="px-20 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Available Rooms</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {rooms.map((room) => {
            const isAvailable =
              room.available.toLowerCase().trim() === "yes" &&
              room.capacity > 0;

            return (
              <div
                key={room._id}
                onClick={() => handleRoomClick(room._id)} // semua kamar bisa diklik
                className={`cursor-pointer transform transition hover:scale-105 ${
                  !isAvailable ? "opacity-70" : ""
                }`}
              >
                <RoomCard
                  title={room.name}
                  price={room.price}
                  available={isAvailable ? "Yes" : "No"}
                  image={room.image}
                />
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
