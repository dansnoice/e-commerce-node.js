const Cart = require("../models/CartModel");
//generator code as temporary placeholder for SessionID
const crypto = require("crypto");
const Product = require("../models/ProductModel");
const Customer = require("../models/CustomerModel");
const { findByIdAndUpdate } = require("../models/OrderModel");
const mongoose = require("mongoose");
const { type } = require("os");
const ObjectId = mongoose.Types.ObjectId;
const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex"); // hex string --notARealSessionId
};

/*  .populate cheat sheet
    bookings = await Booking.find()
      .populate("user", "-bookedEvent -_id")
      .populate("event", "title -_id");
    return bookings;
*/

//this function is not for interacting with the cart
//the intent of this function is to be called at the end of the createCustomer function inside customersController
const initCart = async (customer) => {
  try {
    const cart = await Cart.create({ customer: customer._id });
    // .populate(
    //   "customer",
    //   "name -_id"
    // );
    await Customer.findByIdAndUpdate(
      customer._id,
      { cart: cart._id },
      { new: true }
    );
    const updatedCart = await cart.populate("customer");
    return updatedCart;
  } catch (error) {
    throw error;
  }
};
//the similar but different intent of this function is to create a cart for a guest user
//called at the Product POST method to ensure a call to action from cart counter icon in corner
const makeCart = async (guestSessionId) => {
  try {
    const idToUse = guestSessionId || generateSessionId(); //checks if guestSessionId is passed, else generates a new one
    let existing = await Cart.findOne({ guestSessionId: idToUse });
    //double check if there's a cart with the guestSessionId
    if (existing) return existing; //and returns it if so
    //if not, create a new cart with the sessionId we generated
    const cart = await Cart.create({ guestSessionId: idToUse });
    return cart;
  } catch (error) {
    throw error;
  }
};
const getCarts = async (filterQueries) => {
  try {
    const queryObject = {};

    if (filterQueries.guestSessionId) {
      //default null = falsy
      queryObject.guestSessionId = filterQueries.guestSessionId;
      const cart = await Cart.findOne({
        guestSessionId: filterQueries.guestSessionId,
      })
        .populate("customer", "name -_id")
        .populate("items", "name -_id");
      return cart;
    }
    if (filterQueries.customer) {
      //default null = falsy
      queryObject.customer = filterQueries.customer;
      const cart = await Cart.findOne({ customer: filterQueries.customer })
        .populate("customer", "name -_id")
        .populate("items", "name -_id");
      return cart;
    } //if no lookup id, find and return all carts
    const carts = await Cart.find()
      .populate("customer", "name -_id")
      .populate("items", "name -_id");
    return carts;
  } catch (error) {
    throw error;
  }
};

// items: MUST BE submitted as an array, even if only one item
// {"items": [{ "item": "abc8675309", "quantity": 1 }]}

const updateCartItems = async (cartData) => {
  try {
    let updatedItems = [];
    let total = 0;

    //check that our request has items in the body I kept trying to use "cartData.items.item &&..." but it wouldn't work on the array
    if (Array.isArray(cartData.items) && cartData.items.length > 0) {
      //Now
      //for each {Product: Quantity pair}
      for (const i of cartData.items) {
        //if guest/customer decrements product to quantity to 0, I don't want to push the product:quantity pair to my update array
        if (i.quantity > 0) {
          //item=product found by the i (ObjectId: Quantity)
          const item = await Product.findById(i.item);
          //tempTotal for each pair, using foundProduct's cost
          const itemTotal = item.price * i.quantity;
          //update subtotal
          total += itemTotal;
          //push product:quantity obect to cart update array
          updatedItems.push({
            item: item._id,
            quantity: i.quantity,
          });
        }
      }
      //after building new items array and total, put them in an object we can use to update the cart
      const updateObject = {
        items: updatedItems, //already an arr
        total: total,
      };

      // HANDLING CUSTOMER CARTS

      //if customer truthy && guestSessionId falsy
      if (cartData.customer && !cartData.generateSessionId) {
        const cart = await Cart.findOneAndUpdate(
          { customer: cartData.customer },
          { $set: updateObject },
          { new: true }
        );
        if (cart) return cart;
      }

      //HANDLING GUEST CARTS

      //if customer falsy && guestSessionId truthy
      if (!cartData.customer && cartData.guestSessionId) {
        const cart = await Cart.findOneAndUpdate(
          { guestSessionId: cartData.guestSessionId },
          { $set: updateObject },
          { new: true }
        );
        if (cart) return cart;
      }

      //if both customer and guestSessionId are falsy, we need to make a new cart
      else {
        //we couldn't return a cart from the above two if statements so there must be no customer._id, and guestSessionId is either null or does not reference an existing cart
        const sessionID = cartData.guestSessionId || generateSessionId(); //if there's a guestSessionId just no cart assicated with it, we use that guestSessionId, else we generate a new one
        const newGuestCart = await makeCart(sessionID); //make a cart
        const cart = await Cart.findOneAndUpdate(
          //update it with the updateObject as above
          { guestSessionId: newGuestCart.guestSessionId },
          { $set: updateObject },
          { new: true }
        );
        if (cart) return cart;
      }
      //instead of updating the information, I overwrite it as opposed to adding a Product._id:quantity to the array
      //this assumes we resubmit anything we want to keep in our existing cart, possibly even removing an item entirely if not included, or the quantity is reduced to zero (deleting something in your amazon cart by decrementing it to 0)

      //we will handle cart migration in the opposite direction, where everything just gets thrown into the Customer cart - when integrated with a front end, I will display a popup of the contents of both carts and ask the user to confirm the items to keep in their cart. Needed because I do not allow guests to place orders.
    }
  } catch (error) {
    throw error;
  }
};
const getCartbyId = async (id) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      //tells mongoose "hey see if you can use (id) here as an ._id"
      const cart = await Cart.findById(id); //finds
      return cart; //returns
    }
    //if the URI can't be used as an _id for the cart, it must be a guestSessionId
    const cart = await Cart.findOne({ guestSessionId: id });
    return cart;
  } catch (error) {
    throw error;
  }
};
//write deletion before cart migration function so that we can call it to delete the guest cart
const deleteCart = async (id) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const deletedCart = await Cart.findOneAndDelete({customer: id});
      return deletedCart;
    }
    //if the URI can't be used as an customer id for the cart, it must be a guestSessionId
    const deletedCart = await Cart.findOneAndDelete({ guestSessionId: id });
    return deletedCart;
  } catch (error) {
    throw error;
  }
};
//carts will persist until the customer deletes their account, or converts a guest cart to a customer cart. it will be called upon session expiration, or when the user logs in/registers

const migrateCarts = async (cartsData) => {
  try {
    const cartUpdate = {};
    const updatedItems = [];
    const total = 0;
    if (cartsData.customer && cartsData.guestSessionId) {
      //if we have a customer and a guestSessionId, we can migrate the cart
      const customerCart = await Cart.findOnebyId(cartData.customer);
      const guestCart = await Cart.findOne({
        guestSessionId: cartsData.guestSessionId,
      });
      //add items with quantities > 0 to updatedItems
      if (customerCart && guestCart) {
        for (const i of customerCart.items) {
          if (i.quantity > 0) {
            //item=product found by the i (ObjectId: Quantity)
            const item = await Product.findById(i.item);
            //tempTotal for each pair, using foundProduct's cost
            const itemTotal = item.price * i.quantity;
            //update subtotal
            total += itemTotal;
            //push product:quantity obect to cart update array
            updatedItems.push({
              item: item._id,
              quantity: i.quantity,
            });
          }
        }
        for (const i of guestCart.items) {
          if (i.quantity > 0) {
            //item=product found by the i (ObjectId: Quantity)
            const item = await Product.findById(i.item);
            //tempTotal for each pair, using foundProduct's cost
            const itemTotal = item.price * i.quantity;
            //update subtotal
            total += itemTotal;
            //push product:quantity obect to cart update array
            updatedItems.push({
              item: item._id,
              quantity: i.quantity,
            });
          }
        }
        cartUpdate.items = updatedItems;
        cartUpdate.total = total;
        //set the customer to the new customer
        //we're going to be overwriting the customer cart with the positive quantity items from both carts set update object to equal customer._id
        cartUpdate.customer = cartsData.customer;
        //ensure no guestSessionId is passed in the cart
        cartUpdate.guestSessionId = null;
        //update the customer cart with the merged data
        const updatedCart = await Cart.findByIdAndUpdate(
          customerCart._id,
          cartUpdate,
          { new: true }
        );
        //delete the guest cart
        await deleteCart(guestCart._id);
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
  migrateCarts,
  updateCartItems,
  getCartbyId,
  deleteCart,
};

//when you make this cart into an order confirm stock is available, as well as decrement it
