import React, { useState } from "react";
import { FaUserCircle, FaPen, FaCheck, FaTimes, FaCamera, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyAccount = () => {
  const [profileData, setProfileData] = useState([
    { label: "Name", value: "Ni Kadek Liana Pratiwi" },
    { label: "Display Name", value: "Liana Tantik" },
    { label: "Email Address", value: "liana@example.com" },
    { label: "Phone Number", value: "+628123456789" },
    { label: "Date of Birth", value: "2000-12-12" },
    { label: "Nationality", value: "Indonesia" },
    { label: "Gender", value: "Female" },
    { label: "Address", value: "Jl. Sunset Road No. 30, Kuta, Bali" },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const handleEdit = (index, value) => {
    setEditIndex(index);
    setTempValue(value);
  };

  const handleSave = (index) => {
    const updatedData = [...profileData];
    updatedData[index].value = tempValue;
    setProfileData(updatedData);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      setShowPhotoOptions(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setShowPhotoOptions(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 px-20 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">My Account</h2>

        <div className="flex justify-between items-start">
          {/* Table Section */}
          <table className="w-3/4 border-collapse">
            <tbody>
              {profileData.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-600 font-medium w-1/3">
                    {item.label}
                  </td>

                  <td className="py-4 px-4 text-gray-800">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-amber-600 focus:outline-none"
                      />
                    ) : (
                      item.value
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    {editIndex === index ? (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleSave(index)}
                          className="text-green-600 hover:text-green-700 transition"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(index, item.value)}
                        className="text-gray-700 hover:text-amber-600 transition"
                      >
                        <FaPen size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Profile Photo Section */}
          <div className="relative flex flex-col items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-[#6B4A2B]"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              />
            ) : (
              <FaUserCircle
                className="text-[#6B4A2B] text-9xl cursor-pointer"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              />
            )}

            {/* Popup Options */}
            {showPhotoOptions && (
              <div className="absolute top-44 flex flex-col bg-white shadow-md rounded-md border w-40 text-center z-10">
                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer flex items-center justify-center py-2 hover:bg-gray-100"
                >
                  <FaCamera className="mr-2" /> Change Photo
                </label>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center justify-center py-2 hover:bg-gray-100 text-red-600"
                >
                  <FaTrash className="mr-2" /> Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
