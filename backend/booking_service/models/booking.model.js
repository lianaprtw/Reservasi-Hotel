const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // 1. GUNAKAN OBJECTID + REF
  // Ini adalah perubahan terpenting. Ini memberitahu Mongoose bahwa
  // 'userId' dan 'roomId' adalah referensi ke dokumen di collection lain.
  // Ini memungkinkan Anda menggunakan .populate() nanti.
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', // Nama model 'Room' Anda
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Nama model 'User' Anda
    required: true 
  },

  // 2. TAMBAHKAN 'REQUIRED' PADA DATA PENTING
  // Frontend Anda mengandalkan data ini. Jika kosong,
  // frontend akan menampilkan 'undefined' atau error.
  roomName: { 
    type: String, 
    required: true 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  
  days: { 
    type: Number 
  }, // Opsional, tidak apa-apa
  
  total: { 
    type: Number, 
    required: true 
  },

  // 3. GUNAKAN 'ENUM' UNTUK STATUS
  // Ini mencegah status yang tidak valid (misal: "PENDINGG", "CANCELLED")
  // masuk ke database Anda.
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], // Tentukan status yang valid
    default: 'PENDING'
  },

  // 4. TAMBAHKAN 'IMAGE' (KARENA FRONTEND MENGGUNAKANNYA)
  // Di kode frontend, Anda menggunakan 'booking.image'. 
  // Sebaiknya tambahkan field ini di skema.
  image: {
    type: String
  }
}, {
  // 5. GUNAKAN 'TIMESTAMPS'
  // Ini jauh lebih baik daripada 'createdAt: default: Date.now'
  // Mongoose akan secara otomatis mengelola 'createdAt' dan 'updatedAt'
  timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);