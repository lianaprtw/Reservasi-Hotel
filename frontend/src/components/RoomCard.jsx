import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ id, image, title, price, available }) => { //mendefinisikan komponen fungsional bernama RoomCard
  const navigate = useNavigate(); //inisialisasi navigasi

  const handleDetailClick = () => { //saat tombol detail di klik, user akan diarahkan ke halaman sesuai id kamar
    navigate(`/rooms/${id}`);
  };

  return (
    // membuat card kamar 
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-[300px]">
      {/* bagian gambar */}
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      {/* bagian  tulisan nama kamar dan available */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-gray-500">Available: {available}</p>
        </div>
        {/* bagian tulisan harga */}
        <p className="text-gray-700 font-medium mb-3">${price}</p>

        {/* bagian ikon fasilitas dan tombol detail */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3 text-gray-400">
            <i className="fa-solid fa-tv"></i>
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-mug-saucer"></i>
          </div>

          {/* tombol detail */}
          <button
            onClick={handleDetailClick}
            className="bg-[#9C6644] text-white text-sm px-4 py-1 rounded-md hover:bg-[#7A5232]"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
