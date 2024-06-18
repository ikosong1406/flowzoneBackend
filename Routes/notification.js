const express = require("express");
const Notification = require("../Schemas/Notification");

const router = express.Router();

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json({ notifications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mark notifications as read
router.put("/mark-read/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ msg: "Notification marked as read", notification });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
