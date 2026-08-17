import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";

import userRouter from "./routes/userrRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

// ========================
// Middlewares
// ========================

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(clerkMiddleware());

// ========================
// Database Connection
// ========================

await connectDB();

// ========================
// Home Route
// ========================

app.get("/", (req, res) => {
  res.status(200).send("FriendLoop Server is running");
});

// ========================
// Inngest
// ========================

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// ========================
// Routes
// ========================

app.use("/api/user", userRouter);

app.use("/api/post", postRouter);

app.use("/api/story", storyRouter);

app.use("/api/message", messageRouter);

// ========================
// Export App for Vercel
// ========================

export default app;