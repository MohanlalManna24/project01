import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/noteApp`);
    console.log(`MongoDB Connected successfully`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
