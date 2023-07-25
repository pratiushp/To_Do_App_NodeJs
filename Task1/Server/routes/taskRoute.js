import express from "express";
import {
  addTaskController,
  deleteTaskController,
  editTaskController,
  getAllTasksController,
  getSingleTaskController,
} from "../controllers/taskController.js";
import {
  isAdmin,
  isEmployee,
  isSupervisior,
  requireSignIn,
} from "../middleware/authMiddleware.js";

//router object;

const router = express.Router();

//Add Task
router.post("/add-task", requireSignIn, isAdmin, addTaskController);

router.get(
  "/getall-task",
  requireSignIn,
  isEmployee,
  isSupervisior,
  getAllTasksController
);

//Get Single Task
router.get(
  "/get-task/:id",
  requireSignIn,
  isSupervisior,
  isEmployee,
  getSingleTaskController
);

// Edit a task by its ID
router.put("/edit-task/:id", requireSignIn, isAdmin, editTaskController);

// Delete a task by its ID
router.delete("/delete-task/:id", requireSignIn, isAdmin, deleteTaskController);

export default router;
