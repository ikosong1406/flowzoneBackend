const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

router.post("/", async (req, res) => {
  const { email, bio, skills, portfolioLinks, socialLinks, experience } =
    req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Update user profile
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.portfolioLinks = portfolioLinks || user.portfolioLinks;
    user.socialLinks = socialLinks || user.socialLinks;
    user.experience = experience || user.experience;

    await user.save();
    res.status(200).json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
