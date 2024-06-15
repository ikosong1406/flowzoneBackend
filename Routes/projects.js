const express = require("express");
const { body, validationResult } = require("express-validator");
const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");

const router = express.Router();

// Create a new project
router.post(
  "/create",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("owner").not().isEmpty().withMessage("Owner is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, goals, requirements, timeline, owner } =
      req.body;

    try {
      const project = new Project({
        name,
        description,
        goals,
        requirements,
        timeline,
        owner,
      });

      await project.save();

      // Add project to the owner's list of projects
      const user = await User.findById(owner);
      if (user) {
        user.projects.push(project._id);
        await user.save();
      }

      res.status(201).json({ msg: "Project created successfully", project });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Get a project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner")
      .populate("teamMembers");
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a project
router.put(
  "/:id",
  [
    body("name").optional().not().isEmpty().withMessage("Name is required"),
    body("description")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, goals, requirements, timeline } = req.body;

    try {
      let project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Update project fields
      if (name) project.name = name;
      if (description) project.description = description;
      if (goals) project.goals = goals;
      if (requirements) project.requirements = requirements;
      if (timeline) project.timeline = timeline;

      await project.save();

      // Create notifications for project update
      project.teamMembers.forEach(async (memberId) => {
        const notification = new Notification({
          user: memberId,
          type: "ProjectUpdate",
          message: `The project "${project.name}" has been updated.`,
        });

        await notification.save();
      });

      res.status(200).json({ msg: "Project updated successfully", project });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    await project.remove();
    res.json({ msg: "Project removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Join an existing project
router.post(
  "/join",
  [
    body("projectId").not().isEmpty().withMessage("Project ID is required"),
    body("userId").not().isEmpty().withMessage("User ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, userId } = req.body;

    try {
      const project = await Project.findById(projectId);
      const user = await User.findById(userId);

      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (project.teamMembers.includes(userId)) {
        return res.status(400).json({ msg: "User is already a team member" });
      }

      project.teamMembers.push(userId);
      user.projects.push(projectId);

      await project.save();
      await user.save();

      res
        .status(200)
        .json({ msg: "User added to project successfully", project });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Invite a user to join a project
router.post(
  "/invite",
  [
    body("projectId").not().isEmpty().withMessage("Project ID is required"),
    body("userId").not().isEmpty().withMessage("User ID is required"),
    body("invitedUserId")
      .not()
      .isEmpty()
      .withMessage("Invited User ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, userId, invitedUserId } = req.body;

    try {
      const project = await Project.findById(projectId);
      const user = await User.findById(userId);
      const invitedUser = await User.findById(invitedUserId);

      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      if (!invitedUser) {
        return res.status(404).json({ msg: "Invited user not found" });
      }
      if (project.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ msg: "Only the project owner can invite users" });
      }

      // Check if the invited user is already a team member
      if (project.teamMembers.includes(invitedUserId)) {
        return res.status(400).json({ msg: "User is already a team member" });
      }

      // Send invitation (this is a placeholder, actual implementation may involve sending an email or notification)
      // For simplicity, we'll directly add the invited user to the project
      project.teamMembers.push(invitedUserId);
      invitedUser.projects.push(projectId);

      await project.save();
      await invitedUser.save();

      res.status(200).json({
        msg: "User invited and added to project successfully",
        project,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
