import express from "express";
import {
  changeUserRole,
  deleteUser,
  forgotPasswordController,
  getAdminData,
  getAllUsers,
  getEmployeeData,
  getSupervisiordData,
  loginController,
  registerController,
  resetPasswordController,
  updateUser,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "./../middleware/authMiddleware.js";

//router object;

const router = express.Router();

//Register Router
router.post("/register", registerController);

//Login || POST
router.post("/login", loginController);

// Change user role route
router.post("/change-role/:id", requireSignIn, isAdmin, changeUserRole);

//get admin data
router.get("/getadmin", requireSignIn, isAdmin, getAdminData);

//get supervisior data
router.get("/getsupervisior", requireSignIn, isAdmin, getSupervisiordData);

//get employee data
router.get("/getemployee", requireSignIn, isAdmin, getEmployeeData);

//get all users data
router.get("/getallusers", getAllUsers);

//Delete users data
router.put("/edit-user/:id", updateUser);

//Delete users data
router.delete("/delete-user/:id", deleteUser);

//forgot-passowrd
router.post("/forgot-password", forgotPasswordController);

//Get reset token
// router.get("/reset-password/:resetToken", resetTokenController);

//Post new Password
router.post("/reset-password/:token", resetPasswordController);

//
// router.post("/test" , test )
export default router;
