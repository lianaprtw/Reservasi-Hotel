// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

// Impor controller
const {
  createBooking,
  getMyBookings,
  getBookingById,        // ✅ baru ditambahkan
  cancelBooking,
  getAllBookings,
  getBookingByIdAdmin    // ✅ baru ditambahkan
} = require('../controllers/bookingController');

// Impor middleware keamanan
const { protect, adminCheck } = require('../middleware/authMiddleware');

// 🔹 POST /api/bookings
// Buat booking baru (user harus login)
router.post('/', protect, createBooking);

// 🔹 GET /api/bookings/mybookings
// Get booking milik user
router.get('/mybookings', protect, getMyBookings);

// 🔹 GET /api/bookings/:id
// Get detail booking milik user
router.get('/:id', protect, getBookingById);

// 🔹 DELETE /api/bookings/:id
// Cancel booking milik user
router.delete('/:id', protect, cancelBooking);

// --- Rute Admin ---
// 🔹 GET /api/bookings/admin/all
// Get semua booking untuk admin dashboard
router.get('/admin/all', protect, adminCheck, getAllBookings);

// 🔹 GET /api/bookings/admin/:id
// Get detail booking tertentu untuk admin
router.get('/admin/:id', protect, adminCheck, getBookingByIdAdmin);

module.exports = router;