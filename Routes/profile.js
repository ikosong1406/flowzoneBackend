const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

router.post("/", async (req, res) => {
  try {
    const { userId, fullname, gender, dob } = req.body;

    // Filter out empty or null values from the update data
    const updateData = {};
    if (typeof fullname === "string" && fullname.trim() !== "") {
      updateData.fullname = fullname.trim();
    }
    if (typeof gender === "string" && gender.trim() !== "") {
      updateData.gender = gender.trim();
    }
    if (typeof dob === "string" && dob.trim() !== "") {
      updateData.dob = dob.trim();
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true } // Return the updated document
    );
    res.json({ message: "Profile updated successfully", status: "ok" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
