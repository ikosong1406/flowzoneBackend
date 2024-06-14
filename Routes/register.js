const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../Schemas/UserDetails");

const User = mongoose.model("UserInfo");

router.post("/", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: encryptedPassword,
    });

    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

module.exports = router;
