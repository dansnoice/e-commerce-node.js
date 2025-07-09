const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID
const crypto = require("crypto");
const Product = require("../models/ProductModel");

const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex"); // hex string --notARealSessionId
};

const sessionId = generateSessionId();
//this function is not for interacting with the cart
//the intent of this function is to be called at the end of the createCustomer function inside customersController
const initCart = async (customer) => {
  try {
    const cart = await Cart.create({ customer: customer._id });
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

    const cart = await Cart.create({sessionId});
    return cart;
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
//i will call this from product Controller as I imagine a user viewing a product (a GET request) before deciding to add to cart. for products which may be a combination (sale- toy with batteries - usually sold separately but engaged jointly) we check the body to 

const addProductToCart = async (cartData) => {
  try {
    let updatedItems = [];
    let total = 0;
    //check that our put request has items in the body
    if (cartData.items.item && cartData.items.quantity) {
      //for each {Product: Quantity pair}
      for (const i of cartData.items) {
        //item=product found by the i (ObjectId: Quantity)
        const item = await Product.findById(i.item);
        //tempTotal for each pair, using foundProduct's cost
        const itemTotal = item.price * i.quantity;
        //update subtotal
        total += itemTotal;
        //push pair to cart update array
        updatedItems.push({
          item: item._id,
          quantity: i.quantity,
        });
      }
    }
    //handling guest cart case - haven't made exclusive yet, but no cart should have both a sessionId && customer
    if (cartData.sessionId) {
      //find cart
      const cart = await Cart.findOneAndUpdate(
        { sessionId: cartData.sessionId }, // since we don't have a uuid I set query key to sessionId and use the req body sessionId
        {//push to items every {Product._id:quantity} pair
          $push: { items: { $each: updatedItems } },
          //increment cart total
          $inc: { total: total },
        },
        //will otherwise return old cart
        { new: true }
      );
      return cart;
    }
    //if both failed, we have a user who is not submitting Customer._id nor a sessionId with associated Cart.
    //so we generate them a cart based on the sessionId
    //in implementation they'd have this sessionId after their first successful server request
    else {
      //make a sessionId for test purposes
      const notARealSessionId = generateSessionId();
      //make initialize a cart for this guest
      const starterCart = await makeCart(notARealSessionId);
      //now that they have a cart
      if(starterCart){
        //find it
        const updatedCart = await Cart.findOneAndUpdate
        (
          { sessionId: starterCart.sessionId },
          //update it
        { items: cartData.items },
        { new: true }
        );
        return updatedCart;
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initCart,
  makeCart,
  getCarts,
  addProductToCart,
};


//when you make this cart into an order confirm stock is available, as well as decrement it