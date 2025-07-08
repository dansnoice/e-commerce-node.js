const mongoose = require("mongoose");

const objectId = mongoose.Schema.Types.objectId;

//create schema
const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: objectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      //set possible string values
      enum: ["pending", "shipped", "delivered", "cancelled"],
      //set default
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

//initialize schema as model
const Cart = mongoose.model("Cart", cartSchema);
//export model
module.exports = Order;
