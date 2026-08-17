import express from "express";
import {
  getChatMessage,
  sendMessage,
  sseController,
} from "../controller/messageController.js";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.post("/get", protect, getChatMessage);

messageRouter.post(
  "/send",
  upload.single("image"),
  protect,
  sendMessage
);

messageRouter.get("/:userId", sseController);

export default messageRouter;