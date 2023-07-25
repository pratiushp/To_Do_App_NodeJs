import taskModel from "../model/taskModel.js";
import userModel from "../model/userModel.js";

export const addTaskController = async (req, res) => {
  try {
    const { name, description } = req.body;

    const assigned_by = req.user;
    // get assignedBy by req.user
    // Find the employee user based on their role

    // Find the employee user based on their role
    const assignedEmployee = await userModel.findOne({ role: "Employee" });
    if (!assignedEmployee) {
      return res.status(404).send({
        success: false,
        message: "No employee found to assign the task.",
      });
    }

    const assigned_to = assignedEmployee._id;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Fill Up the name" });
    }
    if (!description) {
      return res.status(400).send({ message: "Fill Up the description" });
    }

    // Check existing task
    const existingTask = await taskModel.findOne({ name });

    // Check Existing task
    if (existingTask) {
      return res.status(200).send({
        success: true,
        message: "Task Already Added",
      });
    }

    // Create and save the new task
    const task = await new taskModel({
      name,
      description,
      assigned_by,
      assigned_to,
    }).save();

    res.status(201).send({
      success: true,
      message: "Task Added Successfully",
      task,
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

//Get All Task contrller
export const getAllTasksController = async (req, res) => {
  try {
    // Find all tasks
    const tasks = await taskModel.find();

    if (tasks.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No tasks found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching tasks",
      error,
    });
  }
};

//Task Single
export const getSingleTaskController = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Find the task with the provided taskId
    const task = await taskModel.findOne(taskId);

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching the task",
      error,
    });
  }
};

//Edit Controller for Task
export const editTaskController = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { name, description } = req.body;

    // Find the task with the provided taskId
    const task = await taskModel.findOne(taskId);

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found.",
      });
    }

    // Update the task with new data
    task.name = name;
    task.description = description;
    const updatedTask = await task.save();

    res.status(200).send({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating the task",
      error,
    });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting data", error });
  }
};
