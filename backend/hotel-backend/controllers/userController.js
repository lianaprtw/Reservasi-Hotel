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
      return res.status(400).json({ message: "Username or email already exists" });

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

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phoneNo = req.body.phone || user.phoneNo;
  user.country = req.body.country || user.country;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    phoneNo: updated.phoneNo,
    country: updated.country,
  });
};

module.exports = { registerUser, authUser, getUserProfile, updateUserProfile };
