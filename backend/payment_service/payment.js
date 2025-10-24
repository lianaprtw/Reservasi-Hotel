const express = require('express');
const amqp = require('amqplib');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

let channel, connection;

const mongoUrl = process.env.MONGO_URL;
const rabbitMqUrl = process.env.RABBITMQ_URL;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Skema Payment sudah benar, menyertakan bookingId
const PaymentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    index: true
  },
  userId: Number,
  roomId: Number,
  amount: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', PaymentSchema);

async function connectRabbitMQ() {
  if (!rabbitMqUrl) {
    console.error("❌ Kesalahan: RABBITMQ_URL tidak ditemukan.");
    process.exit(1);
  }

  let retries = 10;
  while (retries > 0) {
    try {
      connection = await amqp.connect(rabbitMqUrl);

      connection.on('error', (err) => { console.error('❌ RabbitMQ connection error:', err.message); });
      connection.on('close', () => { console.error('❌ RabbitMQ connection closed. Mencoba terhubung kembali...'); setTimeout(connectRabbitMQ, 5000); });

      channel = await connection.createChannel();

      // Pastikan queue untuk menerima booking ada
      const bookingQueue = 'booking_queue';
      await channel.assertQueue(bookingQueue, { durable: true });
      console.log(`✅ RabbitMQ connected in Payment Service (${rabbitMqUrl})`);
      console.log(`   - Listening for messages on ${bookingQueue}`); // Log tambahan

      // --- PERUBAHAN UTAMA DIMULAI DI SINI ---

      // Pastikan queue untuk mengirim konfirmasi status juga ada
      const confirmationQueue = 'payment_status_queue';
      await channel.assertQueue(confirmationQueue, { durable: true });
      console.log(`   - Ready to send to ${confirmationQueue}`); // Log tambahan

      // Consume pesan dari booking_queue
      channel.consume(bookingQueue, async (msg) => {
        if (msg === null) {
          return;
        }

        let bookingMessage; // Definisikan di luar try agar bisa diakses di catch
        try {
          bookingMessage = JSON.parse(msg.content.toString());
          console.log("📩 Booking message received in Payment Service:", bookingMessage);

          if (!bookingMessage.bookingId) {
            console.error("❌ Pesan tidak valid: bookingId tidak ditemukan.");
            channel.ack(msg);
            return;
          }

          // Buat dan simpan data payment
          const payment = new Payment({
            bookingId: bookingMessage.bookingId,
            userId: bookingMessage.userId,
            roomId: bookingMessage.roomId,
            amount: bookingMessage.totalAmount,
            status: 'PAID' // Status internal payment
          });

          const savedPayment = await payment.save();
          console.log("💾 Payment saved to MongoDB for bookingId:", savedPayment.bookingId); // Gunakan savedPayment.bookingId

          // ---- MENGIRIM KONFIRMASI STATUS ----
          // Membuat pesan konfirmasi untuk dikirim kembali ke booking_service
          const confirmationMessage = {
            bookingId: savedPayment.bookingId, // Menggunakan ID dari payment yang baru disimpan
            status: 'CONFIRMED' // Status BARU yang akan diupdate di booking_service
            // Anda bisa menambahkan data lain di sini jika booking_service membutuhkannya
          };

          // Mengirim pesan konfirmasi ke queue 'payment_status_queue'
          channel.sendToQueue(
            confirmationQueue, // Nama queue tujuan
            Buffer.from(JSON.stringify(confirmationMessage)), // Konten pesan (harus Buffer)
            { persistent: true } // Opsi agar pesan tidak hilang jika RabbitMQ restart
          );
          // Log bahwa pesan konfirmasi sudah dikirim
          console.log(`✅ Sent payment confirmation for bookingId: ${savedPayment.bookingId} to ${confirmationQueue}`);
          // ---- SELESAI MENGIRIM KONFIRMASI ----

          // Konfirmasi ke RabbitMQ bahwa pesan booking awal sudah berhasil diproses
          channel.ack(msg);

        } catch (error) {
          console.error(`❌ Error processing booking message for bookingId: ${bookingMessage?.bookingId || 'unknown'}`, error);

          // (OPSIONAL LANJUTAN) Handle Error: Kirim status FAILED jika terjadi error
          if (bookingMessage?.bookingId) { // Hanya kirim jika bookingId ada
             const failedMessage = {
                 bookingId: bookingMessage.bookingId,
                 status: 'FAILED' // Kirim status FAILED
             };
             try {
                 channel.sendToQueue(confirmationQueue, Buffer.from(JSON.stringify(failedMessage)), { persistent: true });
                 console.log(`🟡 Sent payment FAILED confirmation for bookingId: ${bookingMessage.bookingId} to ${confirmationQueue}`);
             } catch (sendError) {
                 console.error(`❌ Failed to send FAILED confirmation for bookingId: ${bookingMessage.bookingId}`, sendError);
             }
          }

          // Tetap ack pesan asli agar tidak menyebabkan loop error tak terbatas
          // Pertimbangkan mekanisme dead-letter queue untuk penanganan error yang lebih baik
          channel.ack(msg);
        }
      }, { noAck: false }); // Penting: noAck harus false untuk menggunakan channel.ack()

      return; // Koneksi Berhasil

    } catch (error) {
      console.error(`❌ RabbitMQ connection error in Payment Service: ${error.message}. Mencoba lagi... (${retries - 1} tersisa)`);
      retries--;
      await sleep(5000);
    }
  }

  console.error("❌ Gagal terhubung ke RabbitMQ. Aplikasi akan keluar.");
  process.exit(1);
}

// Koneksi MongoDB (Tidak berubah)
if (!mongoUrl) {
  console.error("❌ Kesalahan: MONGO_URL tidak ditemukan.");
  process.exit(1);
}
mongoose.connect(mongoUrl)
  .then(() => console.log(`✅ MongoDB connected in Payment Service (${mongoUrl})`))
  .catch(err => console.log("❌ MongoDB connection error:", err.message));

// Server Listen (Tidak berubah)
app.listen(3002, () => {
  console.log('🚀 Payment Service running on port 3002');
  connectRabbitMQ();
});