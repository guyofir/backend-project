const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user-model");
require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.002gm25.mongodb.net/`;

console.log(process.env.MONGODB_PASS)
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
      console.log("User added successfully to User collection");
    } else {
      console.log("User already exists with this id, not create a new user");
    }
  };

connectDb();

createUser();

app.use("/", require("./routes/index"));

app.listen(port, () => console.log(`Server listening on port ${port}`));