import express from "express";
import {
  addTaskController,
  deleteTaskController,
  editTaskController,
  filterDateController,
  getAllTasksController,
  getSingleTaskController,
  getTasksPageController,
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

  getAllTasksController
);

router.get("/get-task-page", requireSignIn, isAdmin, getTasksPageController);

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


//Filter Task Date
router.get("/filter-task", requireSignIn, isAdmin, filterDateController);


export default router;
