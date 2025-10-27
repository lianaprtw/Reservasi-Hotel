const express = require('express');
const router = express.Router();
const cors = require('cors');
const Payment = require('../models/payment.model');

// ✅ Aktifkan CORS khusus route ini
router.use(cors({
  origin: 'http://localhost:5173', // frontend kamu (React)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Preflight (OPTIONS)
router.options('/pay', (req, res) => {
  res.sendStatus(200);
});

// ✅ POST /pay untuk melakukan pembayaran
router.post('/pay', async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardDetails, amount } = req.body;

    // 🛑 Validasi field wajib
    if (!bookingId || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'Missing required fields (bookingId, paymentMethod, amount)' });
    }

    // 💳 Default cardDetails jika metode bukan kartu
    const cardData = paymentMethod === 'credit_card' ? cardDetails : null;

    const payment = new Payment({
      bookingId,
      paymentMethod,
      cardDetails: cardData,
      amount
  // status otomatis pending dari schema
    });

    // 💾 Save ke database
    await payment.save();

    // ✅ Response sukses
    res.status(201).json({
      message: 'Payment successful',
      data: payment
    });

  } catch (err) {
    console.error('Error in /pay:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
