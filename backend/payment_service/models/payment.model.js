const mongoose = require('mongoose');

// Schema untuk menyimpan informasi pembayaran
const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true }, // ID booking yang dibayar
  paymentMethod: { type: String, required: true }, // misal: Credit Card, Transfer
  cardDetails: { // Data kartu jika ada
    cardName: String,
    cardNumber: String,
    expiry: String,
    cvv: String,
  },
  amount: { type: Number, required: true }, // total amount
  status: { type: String, default: 'completed' }, // status: completed, failed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
