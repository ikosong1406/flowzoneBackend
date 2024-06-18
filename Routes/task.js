const express = require("express");
const { body, validationResult } = require("express-validator");
const Task = require("../Schemas/Task");
const Notification = require("../Schemas/Notification");
const Project = require("../Schemas/Project");
require("../Schemas/UserDetails");
const mongoose = require("mongoose");

const User = mongoose.model("UserInfo");

const router = express.Router();

// Create a new task
router.post(
  "/create",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("projectId").not().isEmpty().withMessage("Project ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, projectId, assignee } = req.body;

    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      const task = new Task({
        title,
        description,
        project: projectId,
        assignee,
      });

      await task.save();

      project.tasks.push(task._id);
      await project.save();

      res.status(201).json({ msg: "Task created successfully", task });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Assign a task to a user
router.put(
  "/assign/:taskId",
  [body("assignee").not().isEmpty().withMessage("Assignee is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignee } = req.body;
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      task.assignee = assignee;
      await task.save();

      // Create a notification for task assignment
      const notification = new Notification({
        user: assignee,
        type: "TaskAssignment",
        message: `You have been assigned a new task: "${task.title}".`,
      });

      await notification.save();

      res.status(200).json({ msg: "Task assigned successfully", task });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Update task status
router.put(
  "/status/:taskId",
  [
    body("status")
      .not()
      .isEmpty()
      .withMessage("Status is required")
      .isIn(["Pending", "In Progress", "Completed"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      task.status = status;
      await task.save();

      res.status(200).json({ msg: "Task status updated successfully", task });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
