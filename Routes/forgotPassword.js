const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ResetToken = require("../Schemas/resetToken");
const { passwordReset } = require("../Templates/passwordReset");
const { mailTransport } = require("../utils/mail");
const { createRandomBytes } = require("../utils/helper");

require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Please provide a valid email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found, invalid request!");
    }

    const token = await ResetToken.findOne({ owner: user._id });
    if (token) {
      throw new Error("Only one token request allowed per hour!");
    }

    const randomBytes = await createRandomBytes();
    const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
    await resetToken.save();

    // Constructing the URL with encoded token
    const resetUrl = `http://localhost:3000/resetPassword?token=${randomBytes}&id=${user._id}`;

    // Sending the password reset email with the correct URL
    await mailTransport().sendMail({
      from: "Bitnexsecurity@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: passwordReset(resetUrl),
    });

    res.json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
