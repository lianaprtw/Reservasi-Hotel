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
const { protect } = require('../middleware/authMiddleware'); // Sesuaikan path

// 🔹 POST /api/bookings
// (Buat booking baru) - Dilindungi, user harus login
router.post('/', protect, createBooking);

// 🔹 GET /api/bookings/mybookings
// (Get booking *saya*) - Dilindungi, ini yang dipakai frontend Anda
router.get('/mybookings', protect, getMyBookings);

// 🔹 DELETE /api/bookings/:id
// (Cancel booking *saya*) - Dilindungi
router.delete('/:id', protect, cancelBooking);


// --- Rute Admin (Opsional) ---
// 🔹 GET /api/bookings
// (Get SEMUA booking) - Dilindungi (Harusnya admin)
// Anda perlu middleware `adminCheck` tambahan di sini
// router.get('/', authMiddleware, adminCheck, getAllBookings);

module.exports = router;