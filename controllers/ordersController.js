const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID
const Customer = require("../models/CustomerModel")
const Product = require("../models/ProductModel");
const getNextOrderNumber = require("./countersController");

// update for query by order number or customer (for all orders from the user)....oh god the order doesn't spec an order number?
const getOrder = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (error) {
    throw error;
  }
};

///////////DAN! for the morning - I think the issue is I've been generating dummy carts for postman, and theres no real thing to reference. Seems like a good time to go to bed.
const placeOrder = async (cartData) => {
  try {
    const cart = await Cart.findOne({ customer: cartData.customer });
    //I kept trying to check t
    if (!Array.isArray(cart.items) || cart.items.length === 0) {
      throw new Error("Cart is empty.");
    }

    const orderNumber = await getNextOrderNumber();

    const newPendingOrder = await Order.create({
      customer: cart.customer,
      items: cart.items,
      total: cart.total,
      orderNumber,
      status: "pending",
    });
    //add order._id to customer profile
    const user= await Customer.findById(newPendingOrder.customer)
    user.orders.push(newPendingOrder._id)

    // Clear the cart
    await Cart.findByIdAndUpdate(cart._id, {
      $set: {
        items: [],
        total: 0,
      },
    });

    return newPendingOrder;
  } catch (error) {
    throw error;
  }
};
const updateOrder = async (orderData) => {
  try {
    const orderStatus = orderData.status;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderData._id,
      { $set: orderStatus },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  placeOrder,
  getOrder,
  updateOrder
  
};
