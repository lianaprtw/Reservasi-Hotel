const mongoose = require("mongoose");

// Fungsi untuk koneksi MongoDB
const connectDB = async () => {
  try {
    // Koneksi ke MongoDB dari .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Hentikan server kalau gagal
  }
};

module.exports = connectDB;
