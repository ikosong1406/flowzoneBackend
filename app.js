const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const http = require("http");
const { Server } = require("socket.io");
const register = require("./Routes/register");
const login = require("./Routes/login");
const profile = require("./Routes/profile");
const projects = require("./Routes/projects");
const tasks = require("./Routes/task");
const recommend = require("./Routes/recomend");
const chat = require("./Routes/chat");
const notification = require("./Routes/notification");
const Notification = require("./Schemas/Notification");

const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5001;

const mongoUrl =
  "mongodb+srv://flowzone:flowzone@database.srchsv4.mongodb.net/?retryWrites=true&w=majority&appName=Database";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/register", register);
app.use("/login", login);
app.use("/profile", profile);
app.use("/projects", projects);
app.use("/tasks", tasks);
app.use("/recommend", recommend);
app.use("/chat", chat);
app.use("/notification", notification);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log(`User joined chat room: ${chatRoomId}`);
  });

  socket.on("sendMessage", async ({ chatRoomId, sender, content }) => {
    const message = new Message({
      content,
      sender,
      chatRoom: chatRoomId,
    });

    await message.save();

    io.to(chatRoomId).emit("message", {
      content,
      sender,
      chatRoom: chatRoomId,
      createdAt: message.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.listen(PORT, () => {
  console.log("Server Started");
});
