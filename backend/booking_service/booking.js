require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Impor Rute Anda
const bookingRoutes = require('./routes/booking.routes');
// TAMBAHKAN: Rute untuk login/register
// const userRoutes = require('./routes/user.routes'); 

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Untuk dev, ok. Untuk prod, ganti ke domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Booking Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
// Pasang rute-rute Anda
app.use('/api/bookings', bookingRoutes);
// TAMBAHKAN: Pasang rute user
// app.use('/api/users', userRoutes); 

// Jalankan server
const PORT = process.env.PORT || 3001;
// PERBAIKAN: Gunakan backticks (`)
app.listen(PORT, () => console.log(`🚀 Booking Service running on port ${PORT}`));