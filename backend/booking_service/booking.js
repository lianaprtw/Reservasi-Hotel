require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib'); // RabbitMQ
const cors = require('cors'); // import cors
const bookingRoutes = require('./routes/booking.routes');


// Buat app dulu
const app = express();

// ⚡ Setup CORS dengan konfigurasi lengkap
app.use(cors({
  origin: 'http://localhost:5173', // alamat frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Connect ke MongoDB
mongoose.connect(process.env.MONGO_URL, {})
  .then(() => console.log('✅ Booking Service: MongoDB connected'))
  .catch(err => console.error(err));

// RabbitMQ connection
let channel, connection;
async function connectRabbitMQ() {
  try {
    // Pastikan URL ini benar, atau gunakan 'amqp://localhost:5672'
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    // Gunakan satu nama queue yang konsisten
    await channel.assertQueue('booking_created', { durable: true }); 
    console.log('📨 Booking Service: Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ error:', err);
  }
}
connectRabbitMQ();

// Middleware untuk publish booking ke queue
app.use('/api/bookings', async (req, res, next) => {
  res.publishBooking = async (booking) => {
    if (!channel) {
      console.error('RabbitMQ channel not ready for publishing');
      return;
    }
    // Kirim ke queue yang konsisten
    channel.sendToQueue('booking_created', Buffer.from(JSON.stringify(booking)), { persistent: true });
    console.log('📨 Published booking to RabbitMQ:', booking._id);
  };
  next();
});

// Gunakan routes
app.use('/api/bookings', bookingRoutes);

// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Booking Service running on port ${PORT}`));