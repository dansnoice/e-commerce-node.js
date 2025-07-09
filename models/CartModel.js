const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

//create schema
const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "User",
      default: null, //this allows a cart for a guest user
      //writing this with more features in mind, intent is to tie the Cart._id to the sessionID for continuity between pages in a full stack situation
      //when the user logs in (but before processing) shipping and payment, the cart objectId will be updated to associate with the User._id as opposed to sessionId based _id.
      //in the instance that the user is already associated with a cart, their carts should be migrated for review before final purchase. If quantities
    },

    guestSessionId: {
      type: String,
      default: null, //through logic elsewhere, if there is not a customer.customer(Customer._id), we will track with sessionId
      //
    },
    //items = item:quantity
    items: {
      type: [
        {
          item: {
            type: ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            min: 1,
          },
        },
      ],
      default: [],
    },
    //in controller set to sum of item*quantity
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//initialize schema as model
const Cart = mongoose.model("Cart", cartSchema);
//export model
module.exports = Cart;
