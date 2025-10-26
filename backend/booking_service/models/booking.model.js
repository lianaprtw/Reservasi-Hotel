const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  roomName: { type: String },
  checkIn: { type: Date },
  checkOut: { type: Date },
  days: { type: Number },
  total: { type: Number, required: true },
  status: {
    type: String,
    default: 'PENDING' // Status default
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);