const mongoose = require("mongoose");
const { Schema } = mongoose; // Extract Schema from mongoose

const UserDetailsSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
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
      default: "none",
      enum: ["developer", "designer", "project manager", "other"],
    },
    collaboration: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "none",
      trim: true,
    },
    industry: {
      type: String,
      default: "none",
      trim: true,
    },
    dob: {
      type: String,
      default: "none",
      trim: true,
    },
    attachment: {
      type: String,
      default: "none",
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
