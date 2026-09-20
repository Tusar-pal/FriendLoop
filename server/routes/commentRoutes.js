import express from "express";
import {
  addComment,
  getPostComments,
} from "../controller/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/:postId", addComment);
commentRouter.get("/:postId", getPostComments);

export default commentRouter;