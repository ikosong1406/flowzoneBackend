const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const register = require("./Routes/register");

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

app.listen(PORT, () => {
  console.log("Server Started");
});
