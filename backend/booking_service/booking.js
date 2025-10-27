require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

// Setup CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Booking Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/bookings', bookingRoutes);

// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('🚀 Booking Service running on port ${PORT}'));