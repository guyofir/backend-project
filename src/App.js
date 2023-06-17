const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user-model");
const MONGODB_URI = `mongodb+srv://guyofir21:Guy123@cluster0.002gm25.mongodb.net/?retryWrites=true&w=majority`;

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// connect to the database
const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
  }
};

// add a user to the database
const createUser = async () => {
    const user_id = 123123;
    const user = await User.findOne({ id: user_id });
    if (!user) {
      const user = await User.create({
        id: user_id,
        first_name: "moshe",
        last_name: "israeli",
        birthday: "January, 10th, 1990",
      });
      user.save();
      console.log("User added successfully");
    } else {
      console.log("User already exists, skipping creation");
    }
  };

connectDb();

createUser();

app.use("/", require("./routes/index"));

app.listen(port, () => console.log(`Server listening on port ${port}`));