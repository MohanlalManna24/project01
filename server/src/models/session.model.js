import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},{ timestamps: true });

const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;