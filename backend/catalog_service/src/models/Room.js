import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  imageUrl: { type: String },
  description: { type: String },
  available: { type: String, enum: ["Yes", "No"], default: "Yes" }, // 🟢 tambahkan ini
});

export default mongoose.model("Room", roomSchema);
