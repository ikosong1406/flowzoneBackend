const express = require("express");
require("../Schemas/UserDetails");
const mongoose = require("mongoose");

const User = mongoose.model("UserInfo");
const Project = require("../Schemas/Project");

const router = express.Router();

// Get project recommendations for a user based on their skills and roles
router.get("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const projects = await Project.find({
      $or: [
        { requiredSkills: { $in: user.skills } },
        { requiredRoles: { $in: user.roles } },
      ],
    });

    res.json({ projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
