const express = require('express');
const router = express.Router();
// Pastikan path ini benar mengarah ke file model baru Anda
const Booking = require('../models/booking.model'); 

// 🔹 GET semua booking
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 GET booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 POST buat booking baru
router.post('/', async (req, res) => {
  try {
    const { roomId, userId, roomName, checkIn, checkOut, days, total } = req.body;

    // Cek field wajib
    if (!roomId || !userId || !total) {
      return res.status(400).json({ message: 'Missing required fields: roomId, userId, total' });
    }

    const booking = new Booking({ roomId, userId, roomName, checkIn, checkOut, days, total });
    
    // Simpan ke database (ini memperbaiki error 'callback required')
    await booking.save();

    // Gunakan fungsi publish dari middleware
    await res.publishBooking(booking);

    res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// 🔹 DELETE booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(44).json({ message: 'Booking not found' });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;