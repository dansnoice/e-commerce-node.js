const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID

const Product = require("../models/ProductModel");

const getOrder= async () => {
  try {
    const orders = await Order.find()
    return orders
  } catch (error) {
    throw error
  }
}



const placeOrder = async (cartData) => {
  try {
    const cart = await Cart.findById(cartData.customer);
    if (!cart.customer && cart.sessionId) {
      throw "Please log in and migrate guest cart";
    }
    if (cart.customer && !cart.sessionId) {
      const newPendingOrder = await Order.create(cart);
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
  placeOrder, getOrder
};

