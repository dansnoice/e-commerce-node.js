const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID

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
    const cart = await Cart.findById(cartData.customer);
    if (!cart.customer && cart.guestSessionId) {
      throw "Please log in or create an account to proceed";
    }
    if (cart.customer && !cart.guestSessionId) {
      const orderNumber = await getNextOrderNumber();
      const newPendingOrder = await Order.create({
        customer: cart.customer,
        items: cart.items,
        total: cart.total,
        orderNumber,
        status: "pending", // Optional: Add order status
      });
      //clear the cart of items and total
      cart = await Cart.findByIdAndUpdate(cart.customer, {
        $set: {
          items: [],
          total: 0,
        },
      });
      return newPendingOrder;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  placeOrder,
  getOrder,
};
