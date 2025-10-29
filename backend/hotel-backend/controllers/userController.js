const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// =======================================================
// @desc    Register user (tanpa token)
// @route   POST /api/users/register
// @access  Public
// =======================================================
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, phone, country } = req.body;

    // ✅ Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Cek duplikat username / email
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // ✅ Buat user baru
    const user = await User.create({
      name: name || username,
      username,
      email,
      password,
      phoneNo: phone,
      country,
      role: "user",
    });

    // ✅ Respons tanpa token (user harus login dulu)
    res.status(201).json({
      message: "User registered successfully. Please login to continue.",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================================
// @desc    Login user (dapat token)
// @route   POST /api/users/login
// @access  Public
// =======================================================
const authUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ Hanya saat login kirim token
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================================
// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
// =======================================================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================================
// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
// =======================================================
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedFields = [
      "name",
      "username",
      "email",
      "phoneNo",
      "country",
      "password",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field]) user[field] = req.body[field];
    });

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNo: updatedUser.phoneNo,
        country: updatedUser.country,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
};
