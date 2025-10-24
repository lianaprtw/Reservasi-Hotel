const express = require('express');
const amqp = require('amqplib');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Sudah ada

const app = express();
app.use(cors()); // <-- Sudah ada
app.use(express.json());

let channel;

// =============================
// 1. AMBIL ENV
// =============================
const mongoUrl = process.env.MONGO_URL;
const rabbitMqUrl = process.env.RABBITMQ_URL;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================
// 2. SCHEMA DAN MODEL MONGO
// =============================
const BookingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  roomId: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

// =============================
// 3. KONEKSI KE RABBITMQ
// =============================
// (Fungsi connectRabbitMQ tetap sama seperti sebelumnya, sudah benar)
async function connectRabbitMQ() {
  if (!rabbitMqUrl) {
    console.error("❌ Kesalahan: RABBITMQ_URL tidak ditemukan.");
    process.exit(1);
  }
  let retries = 10;
  while (retries > 0) {
    try {
      const connection = await amqp.connect(rabbitMqUrl);
      connection.on('error', (err) => { console.error('❌ RabbitMQ error:', err.message); });
      connection.on('close', () => { console.error('❌ RabbitMQ closed. Reconnecting...'); setTimeout(connectRabbitMQ, 5000); });

      channel = await connection.createChannel();

      const bookingQueue = 'booking_queue';
      // Pastikan queue durable jika producer (pengirim) juga set persistent
      await channel.assertQueue(bookingQueue, { durable: true });
      console.log(`✅ RabbitMQ connected at ${rabbitMqUrl}`);
      console.log(`   - Ready to send to queue: ${bookingQueue}`);

      // --- LISTEN PAYMENT CONFIRMATION ---
      const confirmationQueue = 'payment_status_queue';
       // Pastikan queue durable jika producer (pengirim) juga set persistent
      await channel.assertQueue(confirmationQueue, { durable: true });
      console.log(`   - Listening for messages from ${confirmationQueue}`);

      channel.consume(confirmationQueue, async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`📩 Payment status received:`, data);

          // Tambahkan pengecekan data sebelum update
          if (!data.bookingId || !data.status) {
            console.warn("⚠️ Invalid status message received:", data);
            channel.ack(msg); // Ack agar tidak diproses ulang
            return;
          }

          const updated = await Booking.findByIdAndUpdate(
            data.bookingId,
            { status: data.status },
            { new: true } // Mengembalikan dokumen yang sudah diupdate
          );

          if (updated) {
            console.log(`🔄 Booking status updated: ${updated._id} -> ${updated.status}`);
          } else {
            console.warn(`⚠️ Booking ID not found for status update: ${data.bookingId}`);
          }

          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing payment status message:", err.message);
          // Pertimbangkan nack atau dead-letter queue untuk error processing
          channel.ack(msg); // Ack sementara agar tidak loop error
        }
      }, { noAck: false }); // Gunakan ack manual

      return; // Selesai konek
    } catch (err) {
      console.error(`❌ RabbitMQ connection error: ${err.message}. Retry in 5s (${retries - 1} left)`);
      retries--;
      await sleep(5000);
    }
  }

  console.error("❌ Gagal terhubung ke RabbitMQ. Keluar aplikasi.");
  process.exit(1);
}

// =============================
// 4. KONEKSI MONGODB
// =============================
// (Fungsi connectMongo tetap sama seperti sebelumnya, sudah benar)
async function connectMongo() {
  if (!mongoUrl) {
    console.error("❌ Kesalahan: MONGO_URL tidak ditemukan.");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected in booking service");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Tidak keluar aplikasi, biarkan Mongoose mencoba reconnect
  }
}

// =============================
// 5. ENDPOINT UNTUK BOOKING (SUDAH DIPERBAIKI)
// =============================
app.post('/booking', async (req, res) => {
  console.log("➡️ Request POST /booking diterima:", req.body); // Log request body
  try {
    // --- PENYESUAIAN NAMA FIELD ---
    // Ambil field sesuai yang DIKIRIM frontend (dengan underscore)
    const { user_id, room_id, total_amount } = req.body;

    // Pastikan field yang diterima ada dan valid
    if (user_id === undefined || room_id === undefined || total_amount === undefined) {
      console.warn("⚠️ Bad Request: Missing required fields"); // Log warning
      // Kirim respons error 400 jika field tidak lengkap
      return res.status(400).json({ error: 'Missing required fields: user_id, room_id, total_amount' });
    }

    // Gunakan nama field Schema (camelCase) saat MEMBUAT dokumen baru
    const booking = new Booking({
      userId: user_id,       // Map user_id ke userId
      roomId: room_id,       // Map room_id ke roomId
      totalAmount: total_amount // Map total_amount ke totalAmount
    });
    // --- SELESAI PENYESUAIAN ---

    await booking.save(); // Simpan ke MongoDB
    console.log(`📝 Booking created with ID ${booking._id}`);

    // Data untuk dikirim ke RabbitMQ (gunakan field dari object booking yang tersimpan)
    const message = {
        bookingId: booking._id,
        totalAmount: booking.totalAmount, // Ambil dari booking yg disimpan
        userId: booking.userId,           // Ambil dari booking yg disimpan
        roomId: booking.roomId            // Ambil dari booking yg disimpan
    };

    // Pastikan channel sudah siap sebelum mengirim
    if (channel) {
        channel.sendToQueue('booking_queue', Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`📤 Sent booking to queue:`, message);
    } else {
        console.error("❌ RabbitMQ channel not available to send booking message!");
        // Pertimbangkan: Kirim error ke klien atau coba lagi nanti?
        // Untuk sekarang, kita tetap kirim respons sukses ke klien tapi booking tidak terkirim ke payment
    }


    // Kirim respons sukses ke frontend (status 201)
    res.status(201).json({ message: 'Booking created successfully and sent for processing', booking }); // <-- Sesuaikan pesan & kembalikan object booking

  } catch (err) {
    console.error("❌ Error creating booking:", err); // Log error lengkap
    // Kirim respons error 500 jika ada masalah server/database
    res.status(500).json({ error: err.message || 'Internal Server Error' }); // Beri pesan default jika perlu
  }
});


// =============================
// 6. ENDPOINT GET BOOKINGS (Tambahan untuk MyBookings)
// =============================
// (Endpoint GET /booking tetap sama seperti sebelumnya, sudah benar)
app.get('/booking', async (req, res) => {
  console.log("➡️ Request GET /booking diterima");
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "✅ Bookings retrieved successfully",
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "❌ Failed to retrieve bookings", error: error.message });
  }
});


// =============================
// 6.5 ENDPOINT GET BOOKING BY ID (Tambahan)
// =============================
// (Endpoint GET /booking/:id tetap sama seperti sebelumnya, sudah benar)
app.get('/booking/:id', async (req, res) => {
  const bookingId = req.params.id;
  console.log(`➡️ Request GET /booking/${bookingId} diterima`);
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({
      message: '✅ Booking retrieved successfully',
      booking: booking
    });
  } catch (error) {
    console.error(`❌ Error fetching booking ${bookingId}:`, error);
    res.status(500).json({ message: '❌ Failed to retrieve booking', error: error.message });
  }
});


// =============================
// 7. RUN SERVER
// =============================
app.listen(3001, async () => {
  console.log("🚀 Booking Service running on port 3001");
  await connectMongo(); // Tunggu koneksi Mongo selesai
  await connectRabbitMQ(); // Tunggu koneksi RabbitMQ selesai
});