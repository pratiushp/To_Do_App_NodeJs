import taskModel from "../model/taskModel.js";

export const addTaskController = async (req, res) => {
  try {
    const { name, description, assigned_to, submission_date } = req.body;

    const assigned_by = req.user;
    // get assignedBy by req.user

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Fill Up the name" });
    }
    if (!description) {
      return res.status(400).send({ message: "Fill Up the description" });
    }

    if (!assigned_to) {
      return res.status(400).send({ message: "Fill Up the Employee ID " });
    }

    if (!submission_date) {
      return res.status(400).send({ message: "Fill Up the Submission Date " });
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

    // const submissiondate = new Date(submission_date);
    // Create and save the new task
    const task = await new taskModel({
      name,
      description,
      assigned_by,
      assigned_to,
      submission_date,
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

// Get  Task controller Pagination
export const getTasksPageController = async (req, res) => {
  try {
    // Adding Pagination
    const limitValue = req.query.limit || 2;
    const currentPage = req.query.page || 1;

    const skipValue = (currentPage - 1) * limitValue;

    // Find all tasks with pagination
    const tasks = await taskModel.find().limit(limitValue).skip(skipValue);

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

// Get  Task controller Pagination
export const getAllTasksController = async (req, res) => {
  try {
    // Find all tasks with pagination
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

//Filter Date
// export const filterDateController = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body;

//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ error: "Both startDate and endDate are required." });
//     }

//     const start_date = new Date(startDate);
//     const end_date = new Date(endDate);

//     const tasks = await taskModel.find({
//       submissiondate: {
//         $gte: start_date,
//         $lte: end_date,
//       },
//     });

//     res.json(tasks);
//   } catch (err) {
//     console.error("Error filtering projects:", err);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };


// Assuming you have already imported the necessary modules and set up the taskModel

export const filterDateController = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Both startDate and endDate are required." });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Check if the input dates are valid
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res
        .status(400)
        .json({ error: "Invalid startDate or endDate format." });
    }

    const projects = await taskModel.find({
      submission_date: {
        $gte: startDateObj,
        $lte: endDateObj,
      },
    });

    res.json(projects);
  } catch (err) {
    console.error("Error filtering projects:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
