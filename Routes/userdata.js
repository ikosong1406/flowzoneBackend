const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

const JWT_SECRET = "qwerty123456";

router.post("/", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email; // Assuming you encoded the email in the token payload

    User.findOne({ email: userEmail })
      .then((data) => {
        if (!data) {
          return res.status(404).send({ error: "User not found" });
        }
        return res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        console.error("Error finding user:", error);
        return res.status(500).send({ error: "Server error" });
      });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ error: "Invalid or expired token" });
  }
});

module.exports = router;
