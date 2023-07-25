import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
    expireIn: Number,
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
