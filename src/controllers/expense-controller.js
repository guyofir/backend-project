const Expense = require("../models/expense-model");
const Report = require("../models/report-model")
const createGetReport = require("../utils/create-or-get-report");
const isValidDate = require("../utils/is-valid-date");
const isValidUser = require("../utils/is-valid-user");

const Categories = [
  "food",
  "health",
  "housing",
  "sport",
  "education",
  "transportation",
  "other",
];

// Helper function to send error responses
const sendErrorResponse = (res, statusCode, status, message) => {
  res.status(statusCode).json({ status, message });
};

// Add a new expense
const addExpense = async (req, res) => {
  const { sum, category, day, month, year, description, user_id } = req.body;
  console.log(req.body)


  // Parameters validation
  if (!sum || !category || !month || !year || !day || !description) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required fields."
    );
    return;
  }

  // Check if the date is valid
  if (!isValidDate(year, month, day)) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Invalid date given, please provide a valid date"
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  // Check if the category is valid
  if (!Categories.includes(category)) {
    sendErrorResponse(res, 400, "fail", "Invalid category provided");
    return;
  }

  try {
    // Create expense
    const expense = await Expense.create({
      user_id,
      year,
      month,
      day,
      description,
      category,
      sum,
    });

    if (expense) {
      await Report.deleteOne({ user_id, year, month });
      res.status(201).json({
        id: expense.id,
        user_id: expense.user_id,
        year: expense.year,
        month: expense.month,
        day: expense.day,
        description: expense.description,
        category: expense.category,
        sum: expense.sum,
      });
    } else {
      sendErrorResponse(
        res,
        400,
        "fail",
        "Could not create expense, please try again later"
      );
    }
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};

// Get all expenses for a given user
const getAllExpenses = async (req, res) => {
  const { user_id, year, month } = req.query;

  // Parameters validation
  if (!month || !year || !user_id) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Please provide all the required parameters"
    );
    return;
  }

  // Check if the date is valid
  if (month < 1 || month > 12 || year < 0) {
    sendErrorResponse(
      res,
      400,
      "fail",
      "Invalid date given, please provide a valid date"
    );
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(user_id, res))) {
    return;
  }

  try {
    const report = await createGetReport(
      user_id,
      year,
      month,
      Categories
    );
    res.status(200).json(report.data);
  } catch (error) {
    sendErrorResponse(res, 500, "error", "Internal server error");
  }
};


module.exports = {
  addExpense,
  getAllExpenses,
};
