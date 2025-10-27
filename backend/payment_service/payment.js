require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 🔹 sudah di-import
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(express.json());

// 🔹 Tambahkan cors middleware
app.use(cors({
  origin: 'http://localhost:5173', // hanya izinkan frontend Vite
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {})
  .then(() => console.log('✅ Payment Service: MongoDB connected'))
  .catch(err => console.error(err));

// Gunakan route payment manual
app.use('/api/payment', paymentRoutes);

// Jalankan server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Payment Service running on port ${PORT}`));
