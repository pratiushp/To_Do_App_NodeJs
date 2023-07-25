import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../model/userModel.js";
import JWT from "jsonwebtoken";

import { sendMail } from "../helper/sendMail.js";

export const registerController = async (req, res) => {
  try {
    const { name, address, email, password } = req.body;
    //validation
    // if (!name) {
    //   return res.send({ message: "Fill Up the name" });
    // }
    // if (!email) {
    //   return res.send({ messa: "Fill Up the Email" });
    // }
    // if (!password) {
    //   return res.send({ message: "Fill Up the password" });
    // }

    // if (!address) {
    //   return res.send({ message: "Fill Up the address" });
    // }

    //....
    //Check  User
    const existingUser = await userModel.findOne({ email });
    //Check Existing User
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "User Already Registered",
      });
    }
    //register User
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      address,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Registration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //Check user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    //Token

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login Error",
      error,
    });
  }
};

//Change Role

// Controller function for updating the user role
export const changeUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user role
    user.role = role;
    await user.save();

    return res.json({ message: "User role updated successfully.", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user role.", error });
  }
};

// Define the controller function to fetch data of admins
export const getAdminData = async (req, res) => {
  try {
    const admins = await userModel.find({ role: "Admin" });
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admin data found." });
    }
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error." });
  }
};

// Define the controller function to fetch data of Supervisior
export const getSupervisiordData = async (req, res) => {
  try {
    const supervisior = await userModel.find({ role: "Supervisior" });
    if (supervisior.length === 0) {
      return res.status(404).json({ message: "No Supervisor data found." });
    }
    return res.status(200).json(supervisior);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error." });
  }
};

// Define the controller function to fetch data of Employee
export const getEmployeeData = async (req, res) => {
  try {
    const employee = await userModel.find({ role: "Employee" });
    if (employee.length === 0) {
      return res.status(404).json({ message: "No Employee data found." });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error." });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user data
    Object.assign(user, updateData);
    await user.save();

    return res.json({ message: "User updated successfully.", user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user.", error });
  }
};

//Delete Controller of USer
// Delete User
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User Data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting User Data", error });
  }
};

// Function to create a reset token for the user
const createResetToken = (user) => {
  return JWT.sign({ _id: user._id }, process.env.RESET_SECRET, {
    expiresIn: "1h", // Token expires in 5 minutes
  });
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a reset token
    const resetToken = createResetToken(user);

    // Save the reset token to the user's schema
    user.resetToken = resetToken;
    await user.save();

    // Send the reset link to the user's email
    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
    await sendMail({
      email: user.email,
      subject: "Reset your password",
      message: `Hello ${user.name}, Click on the link to reset your password: ${resetUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to reset your password`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending reset link" });
  }
};

export const resetPasswordController = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.params.token;

  try {
    // Verify the reset token
    const decoded = JWT.verify(resetToken, process.env.RESET_SECRET);
    console.log("decoded", decoded);

    // Find the user by ID using the token data
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's password and clear the reset token
    user.password = newPassword;
    user.resetToken = undefined;
    await user.save();
    console.log("user::::", user);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
};

// export const test = async (req, res) => {
//   try {
//     console.log("Happy Prajwal");
//   } catch (error) {
//     console.log(error);
//   }
// };
