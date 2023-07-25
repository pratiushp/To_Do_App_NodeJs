import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    assigned_by: {
      type: mongoose.ObjectId,
      required: true,
      ref: "users",
    },
    assigned_to: {
      type: mongoose.ObjectId,
      required: true,
      ref: "users",
    },

    submission_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("tasks", taskSchema);
