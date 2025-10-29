
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import villaImg from "../assets/villa.png";
import room1Img from "../assets/room1.png";
import room2Img from "../assets/room2.png";
import room3Img from "../assets/room3.png";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const navigate = useNavigate();

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
        <h2 className="text-3xl font-bold mb-3">Our Rooms</h2>
        <p className="text-gray-500 mb-8">
          All rooms are designed for your comfort
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              img: room1Img,
              title: "Television set, Extra sheets and Breakfast, etc.",
              available: "The Royal Room",
            },
            {
              img: room2Img,
              title:
                "Television set, Extra sheets, Breakfast, and fireplace, etc.",
              available: "The Deluxe Suite",
            },
            {
              img: room3Img,
              title:
                "Television set, Extra sheets, Breakfast, and bed rest, etc.",
              available: "The Ocean View",
            },
          ].map((room, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img src={room.img} alt="room" className="w-full h-56 object-cover" />
              <div className="p-5 text-left">
                <span className="text-lg text-amber-700 font-semibold">
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
