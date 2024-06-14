const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["developer", "designer", "project manager", "other"],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolioLinks: {
      type: [String],
      default: [],
    },
    socialLinks: {
      type: Map,
      of: String,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsSchema);
