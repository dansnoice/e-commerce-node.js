const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

//create schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: objectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: objectId,
        ref: "Item",
      },
    ],
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

//initialize schema as model
const Order = mongoose.model("Order", orderSchema);
//export model
module.exports = Order;
