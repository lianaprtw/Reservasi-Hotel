import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaPen,
  FaCheck,
  FaTimes,
  FaCamera,
  FaTrash,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const MyAccount = () => {
  const defaultProfile = [
    { label: "Name", value: "Ni Kadek Liana Pratiwi" },
    { label: "Username", value: "liana123" },
    { label: "Email Address", value: "liana@example.com" },
    { label: "Phone Number", value: "+628123456789" },
    { label: "Country", value: "Indonesia" },
  ];

  const [profileData, setProfileData] = useState(defaultProfile);
  const [editIndex, setEditIndex] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // 🔹 Ambil data user dari backend / localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const savedProfile = localStorage.getItem("profileData");
      const savedImage = localStorage.getItem("profileImage");

      if (savedProfile) setProfileData(JSON.parse(savedProfile));
      if (savedImage) setProfileImage(savedImage);

      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = res.data;
          const backendProfile = [
            { label: "Name", value: user.name || "" },
            { label: "Username", value: user.username || "" },
            { label: "Email Address", value: user.email || "" },
            { label: "Phone Number", value: user.phoneNo || "" },
            { label: "Country", value: user.country || "" },
          ];

          setProfileData(backendProfile);
          localStorage.setItem("profileData", JSON.stringify(backendProfile));

          const displayName = user.name || user.username || "Guest";
          localStorage.setItem("displayName", displayName);

          if (user.profileImage) {
            setProfileImage(user.profileImage);
            localStorage.setItem("profileImage", user.profileImage);
          }

          // 🔄 Refresh Navbar
          window.dispatchEvent(new Event("storage"));
        } catch (err) {
          console.warn("⚠ Gagal ambil data user, gunakan localStorage:", err);
        }
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Simpan perubahan lokal ke localStorage + refresh navbar
  const updateLocalStorage = (data) => {
    localStorage.setItem("profileData", JSON.stringify(data));
    const displayName =
      data.find((i) => i.label === "Name" || i.label === "Username")?.value || "";
    if (displayName) localStorage.setItem("displayName", displayName);
    window.dispatchEvent(new Event("storage"));
  };

  const handleEdit = (index, value) => {
    setEditIndex(index);
    setTempValue(value);
  };

  // 🔹 Simpan perubahan ke backend (pakai PUT)
  const handleSave = async (index) => {
    const updatedData = [...profileData];
    updatedData[index].value = tempValue;
    setProfileData(updatedData);
    setEditIndex(null);
    updateLocalStorage(updatedData);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Mapping field label ke key di backend
        const labelMap = {
          Name: "name",
          Username: "username",
          "Email Address": "email",
          "Phone Number": "phoneNo",
          Country: "country",
        };

        const key = labelMap[updatedData[index].label];
        const payload = { [key]: tempValue };

        await axios.put("http://localhost:5000/api/users/me", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("❌ Update ke backend gagal:", err);
    }
  };

  const handleCancel = () => setEditIndex(null);

  // 🔹 Ganti foto profil (preview + localStorage)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      localStorage.setItem("profileImage", imageURL);
      window.dispatchEvent(new Event("storage"));
      setShowPhotoOptions(false);
    }
  };

  // 🔹 Hapus foto profil
  const handleRemovePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
    window.dispatchEvent(new Event("storage"));
    setShowPhotoOptions(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 px-20 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          My Account
        </h2>

        <div className="flex justify-between items-start">
          {/* 🔹 Data Profil */}
          <table className="w-3/4 border-collapse">
            <tbody>
              {profileData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
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

          {/* 🔹 Foto Profil */}
          <div className="relative flex flex-col items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-[#6B4A2B] cursor-pointer"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              />
            ) : (
              <FaUserCircle
                className="text-[#6B4A2B] text-9xl cursor-pointer"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              />
            )}

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
