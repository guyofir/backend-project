const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
} = require("../controllers/expense-controller");


// Define the developers array
const developers = [
  {
    firstname: "Guy",
    lastname: "Ofir",
    id: process.env.GUY_ID,
    email: "guyofir21@gmail.com",
  },
  {
    firstname: "Rotem",
    lastname: "Gershenzon",
    id: process.env.ROTEM_ID,
    email: "rotem.ger207@gmail.com",
  },
];

// setup the routes for the app
router.get("/report", getAllExpenses);
router.post("/addcost", addExpense);
router.get("/about", (req, res) => {
  res.json(developers);
});

module.exports = router;
