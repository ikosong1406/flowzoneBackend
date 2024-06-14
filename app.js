const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const register = require("./Routes/register");
const login = require("./Routes/login");
const profile = require("./Routes/profile");
const projects = require("./Routes/projects");
const tasks = require("./Routes/task");

const PORT = process.env.PORT || 5001;

const mongoUrl =
  "mongodb+srv://trustledger:trustledger@cluster0.pwakngi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

app.listen(PORT, () => {
  console.log("Server Started");
});
