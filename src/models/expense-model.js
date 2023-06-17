const mongoose = require("mongoose");
const getNextSequenceValue = require("../utils/auto-increment");

// Define the schema for costs collection
const costSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: Number,
    required: [true, "No user id entered"],
    index: true,
  },
  year: {
    type: Number,
    required: [true, "No year entered"],
    index: true,
  },
  month: {
    type: Number,
    required: [true, "No month entered"],
    index: true,
  },
  day: { type: Number, required: [true, "No day entered"] },
  description: {
    type: String,
    required: [true, "No description entered"],
  },
  category: {
    type: String,
    enum: [
      "food",
      "health",
      "housing",
      "sport",
      "education",
      "transportation",
      "other",
    ],
  },
  sum: { type: Number, required: [true, "No sum entered"] },
});

costSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = await getNextSequenceValue("Cost", "id");
  }
  next();
});

// Define the model for costs collection
const Cost = mongoose.model("Cost", costSchema);
Cost.createIndexes();

module.exports = Cost;
