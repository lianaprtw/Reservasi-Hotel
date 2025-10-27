const express = require('express');
const router = express.Router();
const Payment = require('../models/payment.model');

// 🔹 GET semua payment
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 POST payment baru
router.post('/pay', async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    if (!bookingId || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'bookingId, paymentMethod, dan amount wajib diisi' });
    }

    const payment = new Payment({
      bookingId,
      paymentMethod,
      amount, // status otomatis pending dari model
    });

    const savedPayment = await payment.save();
    res.status(201).json({ message: 'Payment successful', data: savedPayment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
