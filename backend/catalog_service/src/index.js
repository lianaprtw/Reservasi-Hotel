import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes.js"; // sesuaikan path-nya

dotenv.config();
const app = express();

// ✅ Izinkan akses dari frontend React
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/rooms", roomRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🏨 Catalog Service running on port ${PORT}`)
    );
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
