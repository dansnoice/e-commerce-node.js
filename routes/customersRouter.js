//import router
const express = require("express");
const router = express.Router();
//import functions
const {
  createCustomer,
  getCustomers,
} = require("../controllers/customersController");

router.post("/", async (req, res) => {
  try {
    const newCustomer = await createCustomer(req.body);
    res.status(200).json({
      message: "Successfully created newCustomer",
      payload: newCustomer,
    });
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const customers = await getCustomers();
    res.status(200).json({
      message: "Successfully found customers",
      payload: customers,
    });
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});


//exports
module.exports = router;

// const customerSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true

//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     address: {
//         type: String,
//     },
//     phone: {
//         type: String,
//         unique: true
//     }