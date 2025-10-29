import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../api/roomService";
import axios from "axios";


const AdminDashboard = () => {
  const navigate = useNavigate();

  // 🔹 Data state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorRooms, setErrorRooms] = useState("");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("rooms");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [editRoomData, setEditRoomData] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: "", price: "", capacity: "" });
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const iconClass = "w-5 h-5 cursor-pointer hover:text-[#9C6644] transition";

  // 🔹 Fetch semua user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  // 🔹 Fetch semua bookings (admin)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:3001/api/bookings/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((b) => ({
          ...b,
          user: b.userId || { name: b.fullName || "Unknown" },
          room: { name: b.roomName || "Unknown Room" },
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status || "Pending",
        }));

        setBookings(formatted);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, []);

  // 🔹 Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/rooms?t=${Date.now()}`,
          {
            cache: "no-store", // 🚫 jangan cache response
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (!res.ok) throw new Error("Gagal fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setErrorRooms("⚠️ Room service tidak dapat dijangkau.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);


  // 🔹 CRUD Rooms
  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.price || !newRoom.capacity) return;
    try {
      const added = await createRoom({
        name: newRoom.name,
        price: parseFloat(newRoom.price),
        capacity: parseInt(newRoom.capacity),
      });
      setRooms([...rooms, added]);
      setShowAddRoom(false);
      setNewRoom({ name: "", price: "", capacity: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRoom = (room) => {
    setEditRoomData(room);
    setShowEditRoom(true);
  };

  const handleUpdateRoom = async () => {
    try {
      const updated = await updateRoom(editRoomData._id, {
        name: editRoomData.name,
        price: parseFloat(editRoomData.price),
        capacity: parseInt(editRoomData.capacity),
      });
      setRooms(rooms.map((r) => (r._id === updated._id ? updated : r)));
      setShowEditRoom(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecreaseCapacity = async (roomId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/rooms/${roomId}/decrease`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();

      console.log(data);

      // 🔹 Update state rooms langsung
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r._id === roomId ? { ...r, capacity: data.room.capacity } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };


  // 🔹 Delete user
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      alert("User berhasil dihapus.");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user.");
    }
  };

  // 🔹 Cancel booking
  const handleCancelBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter((b) => b._id !== id));
      alert("Booking berhasil dibatalkan");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Admin profile */}
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

      <h1 className="text-3xl font-bold text-[#9C6644] mb-6 text-center">
        Admin Dashboard
      </h1>

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

      {/* Tabs content */}
      <div className="space-y-8">
        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Booking List</h2>
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["User", "Room", "Check-In", "Check-Out", "Status", "Action"].map((h) => (
                    <th key={h} className="p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.length > 0 ? bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{b.userId?.name}</td>
                    <td className="p-4">{b.room?.name}</td>
                    <td className="p-4">{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td className="p-4">{b.status}</td>
                    <td className="p-4 flex space-x-4">
                      <TrashIcon className={iconClass} onClick={() => handleCancelBooking(b._id)} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                      Tidak ada data booking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ROOMS */}
        {activeTab === "rooms" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Room List</h2>
              <button onClick={() => setShowAddRoom(true)} className="bg-[#9C6644] text-white px-4 py-2 rounded-lg shadow">+ Add Room</button>
            </div>
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["Name", "Price", "Capacity", "Action"].map((h) => <th key={h} className="p-4">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room._id || room.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{room.name}</td>
                    <td className="p-4">${room.price}</td>
                    <td className="p-4">{room.capacity}</td>
                    <td className="p-4 flex space-x-4">
                      <PencilIcon className={iconClass} onClick={() => handleEditRoom(room)} />
                      <TrashIcon className={iconClass} onClick={() => handleDeleteRoom(room._id || room.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  {["Name", "Email", "Action"].map((h) => <th key={h} className="p-4">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center space-x-2">👤 <span>{u.name}</span></td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 flex space-x-4">
                      <TrashIcon className={iconClass} onClick={() => handleDeleteUser(u._id)} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT ROOM POPUP */}
      {(showAddRoom || showEditRoom) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4">
            <h2 className="text-xl font-semibold text-[#9C6644]">{showAddRoom ? "Add New Room" : "Edit Room"}</h2>
            <input type="text" placeholder="Room Name" value={showAddRoom ? newRoom.name : editRoomData?.name || ""} onChange={(e) => showAddRoom ? setNewRoom({ ...newRoom, name: e.target.value }) : setEditRoomData({ ...editRoomData, name: e.target.value })} className="border w-full p-3 rounded" />
            <input type="number" placeholder="Price" value={showAddRoom ? newRoom.price : editRoomData?.price || ""} onChange={(e) => showAddRoom ? setNewRoom({ ...newRoom, price: e.target.value }) : setEditRoomData({ ...editRoomData, price: e.target.value })} className="border w-full p-3 rounded" />
            <input type="number" placeholder="Capacity" value={showAddRoom ? newRoom.capacity : editRoomData?.capacity || ""} onChange={(e) => showAddRoom ? setNewRoom({ ...newRoom, capacity: e.target.value }) : setEditRoomData({ ...editRoomData, capacity: e.target.value })} className="border w-full p-3 rounded" />
            <div className="flex justify-end space-x-4">
              <button onClick={() => showAddRoom ? setShowAddRoom(false) : setShowEditRoom(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button onClick={showAddRoom ? handleAddRoom : handleUpdateRoom} className="px-4 py-2 bg-[#9C6644] text-white rounded-lg">{showAddRoom ? "Add" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
