import Room from "../models/Room.js";

// GET all rooms
export const getRooms = async (req, res) => {
  try {
    const { location, type } = req.query;
    const query = {};

    if (location) query.location = location;
    if (type) query.type = type;

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
export const createRoom = async (req, res) => {
  try {
    console.log("📥 Received body:", req.body); // <--- tambahkan ini
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error("❌ Create room error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
