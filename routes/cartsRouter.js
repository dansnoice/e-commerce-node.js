const express = require("express");
const router = express.Router();

const { initCart, makeCart, getCarts, getCartbyId } = require("../controllers/cartController");
const Cart = require("../models/CartModel");

//I do not intend to create a POST method for my Carts
//If we create a new customer, a new cart is created referencing customer._id
//If our user is a guest (not a Customer) they get a temporary cart that will be migrated on account created or login
//I intend to have a guest cart delete function called when the sessionID expires.

//method for dev purposes only - I'd rather just stay in postman than have to run over to mongo
router.get("/", async (req, res) => {
  try {
    const carts = await getCarts()
    res.status(200).json({
        message: "Successfully located these Carts, you handsome DEVil",
        payload: carts
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const cart = await getCartbyId(req.params.id)
    res.status(200).json({
        message: "Successfully located these Carts, you handsome DEVil",
        payload: cart
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});




//router delete not necessary. Cart Deletion should be handled by cart Controller
//When a guest converts to a Customer through login or registration
//When a user deletes their Customer profile
//In the case of emptying cart due to items removal we PATCH or conversion to cart we use PUT 
module.exports = router;
