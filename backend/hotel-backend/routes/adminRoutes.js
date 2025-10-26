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
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/users", protect, admin, getUsers);
router.route("/users/:id").get(protect, admin, getUserById)
                           .put(protect, admin, updateUser)
                           .delete(protect, admin, deleteUser);

module.exports = router;
