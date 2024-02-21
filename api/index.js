import express from "express";
import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ngwanatuka:1Fjieqmi21@cluster0.xvlz1a9.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error: ", err));

const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
