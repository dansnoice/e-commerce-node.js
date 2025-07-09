const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID
const crypto = require("crypto");
const Product = require("../models/ProductModel")

const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex"); // 32-character hex string
};

const sessionId = generateSessionId();
//this function is not for interacting with the cart
//the intent of this function is to be called at the end of the createCustomer function inside customersController
const initCart = async (customer) => {
  try {
    const cart = await Cart.create({customer: customer._id});
    console.log(
      `successfully created empty cart for new Customer ${cart.customer}`
    );
    return cart;
  } catch (error) {
    throw error;
  }
};
//the similar but different intent of this function is to create a cart for a guest user
//called at the Product POST method to ensure a call to action from cart counter icon in corner
const makeCart = async (sessionId) => {
  try {
    const cart = await Cart.create(sessionId);
    return cart
  } catch (error) {
    throw error;
  }
};
const getCarts = async () => {
  try {
    const carts = await Cart.find();
    return carts;
  } catch (error) {
    throw error;
  }
};
const addProductToCart = async (cartData) => {
  try {
    if (cartData.customer) {
      const cart = await Cart.findByIdAndUpdate(
        cartData.customer,
        cartData.items,
        { new: true }
      );
      // const productData = cartData.items
      // await Product.findByIdAndUpdate(productData,
      //   {stock: stock - productData.quantity}
      // )
      //only update the stock quantities when the cart is made into an order

      return cart;
    }
    if (cartData.sessionId) {
      const cart = await Cart.findOneAndUpdate(
        { sessionId: cartData.sessionId }, // query
        { items: cartData.items }, // update
        { new: true } // return the updated document  
      );
      return cart;
    }
    //if both failed
    else {
      const notARealSessionId = generateSessionId()
      const starterCart = await makeCart(notARealSessionId);
      const updatedCart = await Cart.findOneAndUpdate(
        {sessionId: notARealSessionId},
        {items: cartData.items},
        { new: true }
      );
      return updatedCart;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initCart,
  makeCart,
  getCarts,
  addProductToCart
};
