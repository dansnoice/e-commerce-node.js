const express = require("express");
const router = express.Router();

const { placeOrder, getOrder, updateOrder } = require("../controllers/ordersController");
const Order = require("../models/OrderModel");





//becomes protected route, for dev use
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
router.patch("/", async (req,res)=> {
    try {
        const updatedOrder = await updateOrder(req.body)
        res.status(200).json({
            message: "Successfully updated order status",
            payload: updatedOrder
        })
    } catch (error) {
        res.status(400).json({
          message: "failure",
          payload: error.message,
        });
        
    }
})

//we do not delete orders, we update their status

module.exports = router;
