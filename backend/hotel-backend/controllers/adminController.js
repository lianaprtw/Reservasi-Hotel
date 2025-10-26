const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username & password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ message: "Invalid username or password" });

    res.json({
      _id: admin._id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CRUD USER (ADMIN ONLY)
const getUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phoneNo = req.body.phone || user.phoneNo;
  user.country = req.body.country || user.country;
  if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
  if (req.body.role) user.role = req.body.role;

  const updated = await user.save();
  res.json(updated);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};

module.exports = { registerAdmin, loginAdmin, getUsers, getUserById, updateUser, deleteUser };
