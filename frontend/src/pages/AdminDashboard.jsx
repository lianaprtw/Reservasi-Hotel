import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Data awal
  const [rooms, setRooms] = useState([
    { id: 1, name: "Deluxe Room", price: 120, capacity: 2 },
    { id: 2, name: "Luxury Suite", price: 200, capacity: 4 },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Liana", email: "liana@gmail.com" },
    { id: 2, name: "Angga", email: "angga@gmail.com" },
  ]);

  const [bookings, setBookings] = useState([
    { 
        id: 1, 
        user: "Liana", 
        room: "Deluxe Room", 
        status: "Confirmed",
        checkIn: "2025-10-25",
        checkOut: "2025-10-28" 
    },
    { 
        id: 2, 
        user: "Angga", 
        room: "Luxury Suite", 
        status: "Pending",
        checkIn: "2025-11-01",
        checkOut: "2025-11-05" 
    },
  ]);

  // States
  const [activeTab, setActiveTab] = useState("rooms");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [editRoomData, setEditRoomData] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: "", price: "", capacity: "" });
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const iconClass = "w-5 h-5 cursor-pointer hover:text-[#9C6644] transition";

  // CRUD functions
  const handleDeleteRoom = (id) => setRooms(rooms.filter((room) => room.id !== id));
  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.price || !newRoom.capacity) return;
    const newData = {
      id: Date.now(),
      name: newRoom.name,
      price: parseFloat(newRoom.price),
      capacity: parseInt(newRoom.capacity),
    };
    setRooms([...rooms, newData]);
    setShowAddRoom(false);
    setNewRoom({ name: "", price: "", capacity: "" });
  };
  const handleEditRoom = (room) => { setEditRoomData(room); setShowEditRoom(true); };
  const handleUpdateRoom = () => { 
    setRooms(rooms.map((r) => r.id === editRoomData.id ? editRoomData : r)); 
    setShowEditRoom(false); 
  };
  const handleCancelBooking = (id) => setBookings(bookings.filter((b) => b.id !== id));
  const handleDeleteUser = (id) => setUsers(users.filter((u) => u.id !== id));
  const handleLogout = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">

      {/* Admin Profile */}
      <div className="absolute top-6 right-6">
        <div className="relative">
          <button
            onClick={() => setShowAdminDropdown(!showAdminDropdown)}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            👤
          </button>
          {showAdminDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#9C6644] mb-6 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {["bookings", "rooms", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-[#9C6644] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-8">

        {/* Booking List */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Booking List</h2>
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["User", "Room", "Status", "Check-In", "Check-Out", "Action"].map((header) => (
                    <th key={header} className="p-4 text-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{b.user}</td>
                    <td className="p-4">{b.room}</td>
                    <td className="p-4">{new Date(b.checkIn).toLocaleDateString("id-ID")}</td>
                    <td className="p-4">{new Date(b.checkOut).toLocaleDateString("id-ID")}</td>
                    <td className="p-4">{b.status}</td>
                    <td className="p-4 flex space-x-4">
                      <TrashIcon className={iconClass} onClick={() => handleCancelBooking(b.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Room Management */}
        {activeTab === "rooms" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Room List</h2>
              <button
                onClick={() => setShowAddRoom(true)}
                className="bg-[#9C6644] text-white px-4 py-2 rounded-lg shadow"
              >
                + Add Room
              </button>
            </div>

            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["Name", "Price (USD)", "Capacity", "Action"].map((h) => (
                    <th key={h} className="p-4 text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{room.name}</td>
                    <td className="p-4">${room.price}</td>
                    <td className="p-4">{room.capacity}</td>
                    <td className="p-4 flex space-x-4">
                      <PencilIcon className={iconClass} onClick={() => handleEditRoom(room)} />
                      <TrashIcon className={iconClass} onClick={() => handleDeleteRoom(room.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["Name", "Email", "Action"].map((h) => (
                    <th key={h} className="p-4 text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center space-x-2">
                      👤 <span>{u.name || "-"}</span>
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 flex space-x-4">
                      <TrashIcon className={iconClass} onClick={() => handleDeleteUser(u.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Room Popup */}
      {(showAddRoom || showEditRoom) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4">
            <h2 className="text-xl font-semibold text-[#9C6644]">
              {showAddRoom ? "Add New Room" : "Edit Room"}
            </h2>
            <input
              type="text"
              placeholder="Room Name"
              value={showAddRoom ? newRoom.name : editRoomData?.name || ""}
              onChange={(e) =>
                showAddRoom
                  ? setNewRoom({ ...newRoom, name: e.target.value })
                  : setEditRoomData({ ...editRoomData, name: e.target.value })
              }
              className="border w-full p-3 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={showAddRoom ? newRoom.price : editRoomData?.price || ""}
              onChange={(e) =>
                showAddRoom
                  ? setNewRoom({ ...newRoom, price: e.target.value })
                  : setEditRoomData({ ...editRoomData, price: e.target.value })
              }
              className="border w-full p-3 rounded"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={showAddRoom ? newRoom.capacity : editRoomData?.capacity || ""}
              onChange={(e) =>
                showAddRoom
                  ? setNewRoom({ ...newRoom, capacity: e.target.value })
                  : setEditRoomData({ ...editRoomData, capacity: e.target.value })
              }
              className="border w-full p-3 rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => { showAddRoom ? setShowAddRoom(false) : setShowEditRoom(false); }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={showAddRoom ? handleAddRoom : handleUpdateRoom}
                className="px-4 py-2 bg-[#9C6644] text-white rounded-lg"
              >
                {showAddRoom ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
