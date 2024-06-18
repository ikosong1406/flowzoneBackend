const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ResetToken = require("../Schemas/resetToken");
const { passwordReset } = require("../Templates/passwordReset");
const { mailTransport } = require("../utils/mail");
const { createRandomBytes, sendError } = require("../utils/helper");
const { confirmVerification } = require("../Templates/confirmVerification");

require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

router.post("/", async (req, res) => {
  const { password } = req.body;

  const user = User.findById(req.user._id);
  if (!user) return sendError(res, "User not found.");

  const isSamePassword = await user.comparePassword(password);
  if (!isSamePassword) return sendError(res, "New password must be different.");

  const trimmedPassword = password.trim();
  if (trimmedPassword.length < 8 || trimmedPassword.length > 20)
    return sendError(res, "Password must be 8 to 20 characters long.");

  user.password = trimmedPassword;
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  try {
    await mailTransport().sendMail({
      from: "Bitnexsecurity@gmail.com",
      to: user.email,
      subject: "Password Reset Successfully",
      html: confirmVerification(
        "Password Reset Successfully",
        "Now you can login with the new password."
      ),
    });

    res.json({ success: true, message: "Password Reset Successfully." });
  } catch (error) {
    return sendError(res, "Failed to send email.");
  }
});

module.exports = router;
