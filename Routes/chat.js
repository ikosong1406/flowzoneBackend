const express = require("express");
const { body, validationResult } = require("express-validator");
const Message = require("../Schemas/Message");
const ChatRoom = require("../Schemas/ChatRoom");
require("../Schemas/UserDetails");
const mongoose = require("mongoose");

const User = mongoose.model("UserInfo");

const router = express.Router();

// Create a new message
router.post(
  "/send",
  [
    body("content").not().isEmpty().withMessage("Content is required"),
    body("sender").not().isEmpty().withMessage("Sender is required"),
    body("chatRoom").not().isEmpty().withMessage("Chat room is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, sender, chatRoom } = req.body;

    try {
      const message = new Message({
        content,
        sender,
        chatRoom,
      });

      await message.save();
      res.status(201).json({ msg: "Message sent successfully", message });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Get messages for a chat room
router.get("/:chatRoomId", async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoom: chatRoomId }).populate(
      "sender",
      "name"
    );
    res.json({ messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
