const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, phone, country } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Required fields missing" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return res
        .status(400)
        .json({ message: "Username or email already exists" });

    const user = await User.create({
      name: name || username,
      username,
      email,
      password,
      phoneNo: phone,
      country,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
const authUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid username or password" });

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE USER PROFILE (PUT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Update hanya field yang dikirim
    const allowedFields = [
      "name",
      "username",
      "email",
      "phoneNo",
      "country",
      "password",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNo: updatedUser.phoneNo,
      country: updatedUser.country,
    });
  } catch (error) {
    console.error("❌ Update profile failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { registerUser, authUser, getUserProfile, updateUserProfile };
