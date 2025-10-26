const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);

// Private routes
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

module.exports = router;
