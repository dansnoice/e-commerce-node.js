const express = require("express");
const router = express.Router();

const { getCarts, getCartbyId, updateCartItems, migrateCarts } = require("../controllers/cartController");
const Cart = require("../models/CartModel");

//I do not intend to create a POST method for my Carts
//If we create a new customer, a new cart is created referencing customer._id
//If our user is a guest (not a Customer) they get a temporary cart made as a fallback by our "add item to cart" that will then be migrated on account creation/login

router.get("/", async (req, res) => {
  try {
    const carts = await getCarts(req.query)
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
        message: "Successfully located this Cart, you handsome DEVil",
        payload: cart
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.post("/checkout", async (req, res) => {
  try {
    const cartToBuy = await migrateCarts(req.body);
    res.status(200).json({
      message: "Successfully migrated carts for checkout, you may now place an order",
      payload: cartToBuy,
    });
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
  }
});
router.patch("/", async (req,res) => {
  try {
    const cart = await updateCartItems(req.body)
    res.status(200).json({
        message: "Successfully updated this cart, you handsome DEVil",
        payload: cart
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
    
  }
})




//router delete not necessary. Cart Deletion should be handled by cart Controller when:
//a guest converts to a Customer through login or registration, or session expires
//When a user deletes their Customer profile
//In the case of emptying cart due to items removal we PATCH or conversion to cart we use PUT 
module.exports = router;
