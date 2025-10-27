const mongoose = require('mongoose');

function maskCard(number) {
  if (!number) return null;
  return '**** **** **** ' + number.slice(-4);
}

const paymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['credit_card', 'bank_transfer', 'ewallet'] 
  },
  cardDetails: {
    cardName: { type: String },
    cardNumber: { 
      type: String,
      get: maskCard // otomatis masking saat fetch
    },
    expiry: String,
    cvv: { type: String, select: false } // disembunyikan untuk keamanan
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
}, { 
  toJSON: { getters: true }, 
  toObject: { getters: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
