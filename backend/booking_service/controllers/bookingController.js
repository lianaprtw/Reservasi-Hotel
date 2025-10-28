// controllers/bookingController.js
const Booking = require('../models/booking.model');

// @desc    Buat booking baru
// @route   POST /api/bookings
// @access  Private (Hanya user yang login)
const createBooking = async (req, res) => {
  try {
    const { roomId, roomName, checkIn, checkOut, days, total, image } = req.body;

    // VALIDASI: Cek field wajib
    if (!roomId || !total || !checkIn || !checkOut || !roomName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // PENTING: Ambil userId dari token, BUKAN dari req.body
    // Ini mencegah user memalsukan "userId"
    const userId = req.user.id; 

    const booking = new Booking({
      roomId,
      userId, // Aman, dari token
      roomName,
      checkIn,
      checkOut,
      days,
      total,
      image // Tambahkan image jika ada (sesuai schema Anda)
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);

  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get booking milik user yang login
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    // Cari booking berdasarkan userId dari token (req.user.id)
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // KEAMANAN: Cek apakah booking ini milik user yang login
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Hapus booking
    await booking.remove();
    res.json({ message: 'Booking cancelled successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Rute Admin (Opsional) ---

// @desc    Get SEMUA booking (Hanya untuk Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  // Anda harus menambahkan cek admin di sini, misal:
  // if (!req.user.isAdmin) { return res.status(401).json(...) }
  try {
    const bookings = await Booking.find().populate('user', 'name'); // Contoh populate
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
};