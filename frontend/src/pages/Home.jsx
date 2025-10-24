import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import villaImg from "../assets/villa.png";
import room1Img from "../assets/room1.png";
import room2Img from "../assets/room2.png";
import room3Img from "../assets/room3.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { roomsData } from "../data/rooms";

const Home = () => {
  const navigate = useNavigate();

  // state input
  const [loc, setLoc] = useState("");
  const [roomType, setRoomType] = useState("");
  const [person, setPerson] = useState("1");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

//   const locationOptions = ["Ubud", "Kuta", "Jakarta", "Tokyo", "Singapore"];
  const roomTypeOptions = ["The Royal Room", "The Deluxe Suite", "The Ocean View"];

  const isBookNowActive = roomType && person && checkIn && checkOut;

  const handleBookNow = () => {
    if (!isBookNowActive) return;

    const selectedRoom = roomsData.find((room) => room.name === roomType);

    navigate("/booking", {
      state: {
        location: loc,
        roomName: selectedRoom?.name || roomType,
        price: selectedRoom?.price || 0,
        roomId: selectedRoom?.id,
        person,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
    });
  };

  const facilities = [
    { icon: "ri-wifi-line", label: "Wifi" },
    { icon: "ri-cup-line", label: "Breakfast" },
    { icon: "ri-gamepad-line", label: "Game Center" },
    { icon: "ri-sun-line", label: "24/7 Light" },
    { icon: "ri-shirt-line", label: "Laundry" },
    { icon: "ri-parking-box-line", label: "Parking Space" },
  ];

  return (
    <div className="font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-white">
        <div className="md:w-1/2 space-y-5">
          <h2 className="text-amber-700 text-4xl font-semibold font-serif">
            Puri Indah
          </h2>
          <h1 className="text-5xl font-bold leading-tight">
            Hotel for every moment rich in emotion
          </h1>
          <p className="text-gray-500">
            Every moment feels like the first time in paradise view.
          </p>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
          >
            Book now
          </button>
        </div>

        <div className="md:w-1/3 mt-10 md:mt-0">
          <img
            src={villaImg}
            alt="Hotel"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>
      </section>

      {/* Booking Filter (pakai dropdown) */}
      <section className="bg-white px-8 py-6 shadow-lg mx-10 -mt-8 rounded-lg flex flex-wrap justify-between items-center gap-4">
        {/* Lokasi */}
        {/* <div className="flex items-center space-x-2">
          <i className="ri-map-pin-line text-amber-700 text-xl"></i>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="font-semibold  border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="" disabled hidden>
                Choose location
              </option>
              {locationOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {/* Room type (FIXED) */}
        <div className="flex items-center space-x-2">
          <i className="ri-hotel-line text-amber-700 text-xl"></i>
          <div>
            <p className="text-sm text-gray-500">Room type</p>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="font-semibold  border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="" disabled hidden>
                Choose room type
              </option>
              {roomTypeOptions.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Person */}
        <div className="flex items-center space-x-2">
          <i className="ri-user-line text-amber-700 text-xl"></i>
          <div>
            <p className="text-sm text-gray-500">Person</p>
            <input
              type="number"
              min="1"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-16 font-semibold outline-none  rounded text-center"
            />
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-center space-x-2">
          <i className="ri-calendar-line text-amber-700 text-xl"></i>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Date</p>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                placeholderText="Check-in"
                dateFormat="dd/MM/yyyy"
                className="font-semibold outline-none rounded px-2 py-1"
              />
              <span className="text-gray-400">—</span>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                placeholderText="Check-out"
                dateFormat="dd/MM/yyyy"
                className="font-semibold outline-none rounded px-2 py-1"
                min={checkIn || undefined}
              />
            </div>
          </div>
        </div>

        {/* Tombol Book Now */}
        <button
          onClick={handleBookNow}
          disabled={!isBookNowActive}
          className={`px-6 py-3 rounded-lg transition ${
            isBookNowActive
              ? "bg-amber-700 text-white hover:bg-amber-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book Now
        </button>
      </section>

      {/* Facilities Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Our Facilities</h2>
        <p className="text-gray-500 mb-10">
          We offer modern (5 star) hotel facilities for your comfort.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {facilities.map((facility, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition flex flex-col items-center"
            >
              <i className={`${facility.icon} text-3xl text-amber-700 mb-3`}></i>
              <p className="font-semibold text-gray-700">{facility.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms Section */}
      <section className="bg-amber-50 py-16 px-10 text-center">
        <h2 className="text-3xl font-bold mb-3">Luxurious Rooms</h2>
        <p className="text-gray-500 mb-8">
          All rooms are designed for your comfort
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              img: room1Img,
              title: "Television set, Extra sheets and Breakfast",
              available: "2 Rooms available",
            },
            {
              img: room2Img,
              title:
                "Television set, Extra sheets, Breakfast, and fireplace",
              available: "4 Rooms available",
            },
            {
              img: room3Img,
              title:
                "Television set, Extra sheets, Breakfast, and bed rest",
              available: "8 Rooms available",
            },
          ].map((room, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img src={room.img} alt="room" className="w-full h-56 object-cover" />
              <div className="p-5 text-left">
                <span className="text-sm text-amber-700 font-semibold">
                  {room.available}
                </span>
                <p className="mt-2 text-gray-700">{room.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
