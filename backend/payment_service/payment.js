require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require('cors'); // 🔹 sudah di-import
const paymentRoutes = require('./routes/payment.routes');
const Payment = require('./models/payment.model');

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

// RabbitMQ consumer
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue('booking_created');

    channel.consume('booking_created', async (msg) => {
      if (msg !== null) {
        const booking = JSON.parse(msg.content.toString());
        console.log('📨 Received booking from RabbitMQ:', booking);

        // // Simulasi payment otomatis
        // const payment = new Payment({
        //   bookingId: booking._id,
        //   paymentMethod: 'Credit Card',
        //   amount: booking.total,
        //   status: 'pending', // status awal pending
        // });
        // await payment.save();
        // console.log('✅ Payment record created for booking:', booking._id);

        channel.ack(msg);
      }
    });
    console.log('📡 Payment Service listening to booking_created queue');
  } catch (err) {
    console.error('❌ RabbitMQ error:', err);
  }
}
connectRabbitMQ();

// Gunakan route payment manual
app.use('/api/payment', paymentRoutes);

// Jalankan server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Payment Service running on port ${PORT}`));
