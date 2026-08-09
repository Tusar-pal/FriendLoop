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

// Connect Database
await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Home Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Inngest Route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// User Routes
app.use("/api/user", userRouter);

app.use('/api/post',postRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',messageRouter)
// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

