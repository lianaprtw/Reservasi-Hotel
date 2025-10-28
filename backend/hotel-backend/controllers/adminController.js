const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fungsi generate token JWT
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ====================== REGISTER ADMIN ======================
const registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username & password required" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({
      name,
      username,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully. Please login to get your token.",
      admin: {
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGIN ADMIN ======================
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== CRUD USER (ADMIN ONLY) ======================

// 🟢 hanya tampilkan user milik admin login
// Ambil semua user role "user" (baik yang dibuat sendiri maupun oleh admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟢 saat admin menambahkan user, simpan siapa pembuatnya
const createUser = async (req, res) => {
  try {
    const { name, username, email, password, phoneNo, country } = req.body;

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({
      name,
      username,
      email,
      password,
      phoneNo,
      country,
      role: "user",
      createdBy: req.user._id, // ini kuncinya
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    createdBy: req.user._id, // hanya user milik admin ini
  }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phoneNo = req.body.phoneNo || user.phoneNo;
  user.country = req.body.country || user.country;
  if (req.body.password)
    user.password = await bcrypt.hash(req.body.password, 10);

  const updated = await user.save();
  res.json(updated);
};

const deleteUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
