import express from "express";

import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  decreaseRoomCapacity,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", createRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

router.put("/:id/decrease", decreaseRoomCapacity);
export default router;
