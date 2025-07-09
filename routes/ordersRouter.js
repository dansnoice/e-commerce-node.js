const express = require("express");
const router = express.Router();

const { placeOrder, getOrder } = require("../controllers/ordersController");
const Order = require("../models/OrderModel");





//method for dev purposes only - I'd rather just stay in postman than have to run over to mongo
router.get("/", async (req, res) => {
  try {
    const orders = await getOrder()
    res.status(200).json({
        message: "Successfully located these orders, you handsome DEVil",
        payload: orders
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
}
});
router.post("/", async (req,res)=> {
    try {
        const newOrder = await placeOrder(req.body)
        res.status(200).json({
            message: "Successfully placed this pending order - your will receive notification when your order status has changed. Thank you for shopping with us!",
            payload: newOrder
        })
    } catch (error) {
        res.status(400).json({
          message: "failure",
          payload: error.message,
        });
        
    }
})


module.exports = router;
