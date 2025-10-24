import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ id, image, title, price, available }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-[300px]">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-gray-500">Available: {available}</p>
        </div>
        <p className="text-gray-700 font-medium mb-3">${price}</p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3 text-gray-400">
            <i className="fa-solid fa-tv"></i>
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-mug-saucer"></i>
          </div>

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
