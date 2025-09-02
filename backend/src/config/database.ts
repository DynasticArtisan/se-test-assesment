import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = process.env.MONGODB_URL;
    if (!dbUrl) {
        throw new Error("")
    }
    const db = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};