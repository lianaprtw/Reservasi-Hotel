const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  registerAdmin,
  loginAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} = require("../controllers/adminController");
const User = require("../models/userModel"); // tambahkan ini untuk query langsung ke DB

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/admins", protect, admin, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Admin membuat user baru
router.post("/users", protect, admin, createUser);

router.get("/users", protect, admin, getUsers);
router
  .route("/users/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;

