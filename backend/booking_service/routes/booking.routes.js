// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

// Impor controller
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController'); // Sesuaikan path

// Impor middleware keamanan
const { protect, adminCheck } = require('../middleware/authMiddleware'); // 🔹 pastikan adminCheck sesuai

// 🔹 POST /api/bookings
// (Buat booking baru) - Dilindungi, user harus login
router.post('/', protect, createBooking);

// 🔹 GET /api/bookings/mybookings
// (Get booking *saya*) - Dilindungi, ini yang dipakai frontend Anda
router.get('/mybookings', protect, getMyBookings);

// 🔹 DELETE /api/bookings/:id
// (Cancel booking *saya*) - Dilindungi
router.delete('/:id', protect, cancelBooking);


// --- Rute Admin (Tambahan, kode lama tetap utuh) ---
// 🔹 GET /api/bookings
// (Get SEMUA booking) - Dilindungi (Harusnya admin)
// router.get('/', authMiddleware, adminCheck, getAllBookings);

// ✅ RUTE BARU UNTUK ADMIN DASHBOARD
// Aktif dan aman: menampilkan semua booking untuk dashboard admin
router.get('/admin/all', protect, adminCheck, getAllBookings);


// --- Akhir ---
module.exports = router;
