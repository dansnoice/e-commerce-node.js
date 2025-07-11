//import router
const express = require("express");
const router = express.Router();
//import functions
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customersController");
const deleteCart = require("../controllers/cartController").deleteCart;

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
    const customer = await getCustomers(req.params);
    res.status(200).json({
      message: "Successfully found customer",
      payload: customer,
    });
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.patch("/:customerId", async (req, res) => {
  try {
    const customer = await updateCustomer(req.params.customerId, req.body);
    res.status(200).json({
      message: `Successfully updated customer: ${customer.name}`,
      payload: customer,
    });
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.delete("/:customerId", async (req, res) => {
  try {
    // find em
    const checkCustomer = await getCustomers(req.params.customerId);

    if (checkCustomer) {
      // mash em
      await deleteCart(checkCustomer._id);
      const customerToDelete = await deleteCustomer(req.params.customerId);
      await deleteCart(checkCustomer._id)
      res.status(200).json({
        message: `Successfully deleted customer.`,
        //no payload stew for you
      });
    } else {
      res.status(404).json({
        message: "Customer not found.",
      });
    }

  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});

//exports
module.exports = router;
