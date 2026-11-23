import mongoose from "mongoose";

import AppError from "../utils/AppError.js";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI;

    if (!mongoUrl) {
      throw new AppError("MONGODB_URI is missing in .env file", 500);
    }

    const connect = await mongoose.connect(mongoUrl);

    console.log(`MongoDB Connected: ${connect.connection.host}`);

  } catch (error) {
    throw new AppError("MongoDB connection failed", 500);
  }
};

export default connectDB;