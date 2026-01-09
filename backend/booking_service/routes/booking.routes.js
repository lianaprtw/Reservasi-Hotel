const express = require('express');
const router = express.Router();

/* ================= TEST ROUTE (PALING ATAS) ================= */
router.get('/test', (req, res) => {
  res.json({ status: 'BOOKING SERVICE OK' });
});

/* ================= ADMIN ROUTES ================= */
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getBookingByIdAdmin
} = require('../controllers/bookingController');

const { protect, adminCheck } = require('../middleware/authMiddleware');

router.get('/admin/all', protect, adminCheck, getAllBookings);
router.get('/admin/:id', protect, adminCheck, getBookingByIdAdmin);

/* ================= USER ROUTES ================= */
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);

/* ⚠️ ROUTE DINAMIS HARUS PALING BAWAH */
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
