import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    resetToken: {
      type: String,
    },

    role: {
      type: String,
      enum: ["User", "Employee", "Supervisior", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);

// const validate = (user) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     address: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   });
//   return schema.validate(user);
// };
