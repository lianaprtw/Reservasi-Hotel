// controllers/bookingController.js
const Booking = require('../models/booking.model');

// ===============================================
// 🔹 USER ROUTES
// ===============================================

// @desc    Buat booking baru
// @route   POST /api/bookings
// @access  Private (user)
const createBooking = async (req, res) => {
  try {
    const { roomId, roomName, checkIn, checkOut, days, total, image } = req.body;

    if (!roomId || !roomName || !checkIn || !checkOut || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userId = req.user.id;

    const booking = new Booking({
      roomId,
      userId,
      roomName,
      checkIn,
      checkOut,
      days,
      total,
      image,
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get booking milik user yang login
// @route   GET /api/bookings/mybookings
// @access  Private (user)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (user)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Pastikan booking milik user yang login
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await booking.remove();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===============================================
// 🔹 ADMIN ROUTES
// ===============================================

// @desc    Get semua booking (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    // Cek admin (opsional jika sudah dicek di middleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const bookings = await Booking.find()
      .populate('userId', 'name email') // populate user info
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
};
