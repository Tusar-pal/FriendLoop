import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return;
    }

    await mongoose.connect(
      `${process.env.MONGODB_URL}/friendLoop`
    );

    console.log("✅ MongoDB Atlas Connected Successfully");

  } catch (error) {
    console.error(
      "❌ MongoDB Connection Error:",
      error.message
    );

    throw error;
  }
};

export default connectDB;