const express = require('express');
const router = express.Router();
const cors = require('cors'); // 🔹 Tambahkan ini
const Payment = require('../models/payment.model');

// 🔹 Tambahkan middleware CORS di router
router.use(cors({
  origin: 'http://localhost:5173', // alamat frontend
  methods: ['POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 🔹 Tangani preflight OPTIONS
router.options('/pay', (req, res) => {
  res.sendStatus(200);
});

// Route untuk melakukan pembayaran
router.post('/pay', async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardDetails, amount } = req.body;

    // Validasi input
    if (!bookingId || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Simulasi payment process
    const payment = new Payment({
      bookingId,
      paymentMethod,
      cardDetails,
      amount,
      status: 'completed' // Simulasi payment sukses
    });

    // Simpan ke database
    await payment.save();

    // Kirim response payment sukses
    res.status(201).json(payment);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
